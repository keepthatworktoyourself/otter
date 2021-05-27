import test from 'ava'
import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({ adapter: new Adapter() })


const block = {
  type: 'X',
  fields: [
    {
      name:        'image',
      description: 'My WP Image',
      type:        Otter.Fields.WPMedia,
      media_types: ['jpeg'],
    },
  ],
}
const data_item = {
  __type: 'X',
  image: {
    id: 2434,
    thumbnail: 'http://test.com/x.jpg',
  },
}


const spy__open_media_browser = sinon.spy(Otter.Fields.components.WPMedia.prototype, 'open_media_browser')


function mk(field_def, containing_data_item, ctx_methods, is_top_level) {
  const wrapper = shallow(<Otter.Fields.components.WPMedia field_def={field_def}
                                                           containing_data_item={containing_data_item}
                                                           consumer_component={stubs.func_stub([{...ctx_methods}])}
                                                           is_top_level={is_top_level} />)
  return wrapper.dive()
}


test('WPMedia: select button rendered and begins wp selection', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true },
    should_redraw() { ctx.should_redraw.called = true },
  }

  const wrapper = mk(block.fields[0], data_item, ctx, true)
  const btn = wrapper.find('.wpmedia-select-btn')
  t.is(1, btn.length)

  const event_listeners = { }
  window.addEventListener = (ev, cb) => event_listeners[ev] = cb
  window.removeEventListener = (ev, cb) => event_listeners[ev] = null

  // Binds image selection message
  btn.prop('onClick')({})
  t.is('function', typeof event_listeners['message'])

  // Opens media browser in window parent
  t.is(1, spy__open_media_browser.callCount)
  t.deepEqual([block.fields[0]], spy__open_media_browser.firstCall.args)

  // Image selection callback sets value, calls ctx updated methods, unbinds image selection message
  const new_value = 'a new item'
  event_listeners['message']({
    stopPropagation() { },
    data: {
      'otter--set-wp-media-item': new_value,
    },
  })
  t.is(null, event_listeners['message'])
  t.is(true, ctx.value_updated.called)
  t.is(true, ctx.should_redraw.called)
})


test('WPMedia: renders image thumbnail', t => {
  const wrapper = mk(block.fields[0], data_item, {})
  const image = wrapper.find('img')
  t.is(1, image.length)
  t.is(data_item.image.thumbnail, image.prop('src'))
})


test('WPMedia: clear btn sets value to null, calls ctx update methods', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true },
    should_redraw() { ctx.should_redraw.called = true },
  }
  const d = Otter.Utils.copy(data_item)
  const wrapper = mk(block.fields[0], d, ctx)
  const clearbtn = wrapper.find('.wpmedia-clear-btn')

  clearbtn.prop('onClick')({})
  t.is(null, d.image)
  t.is(true, ctx.value_updated.called)
  t.is(true, ctx.should_redraw.called)
})


test('WPMedia: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk(block.fields[0], data_item, {}, true)
  const wrapper__nested = mk(block.fields[0], data_item, {}, false)

  const lbl__top    = wrapper__top.find('FieldLabel')
  const lbl__nested = wrapper__nested.find('FieldLabel')

  t.is(1, lbl__top.length)
  t.is(1, lbl__nested.length)
  t.is('My WP Image', lbl__top.get(0).props.label)
  t.is(true,  lbl__top.get(0).props.is_top_level)
  t.is(false, lbl__nested.get(0).props.is_top_level)
})

