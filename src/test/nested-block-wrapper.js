import test from 'ava'
import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import PageDataContext from '../core/PageDataContext'
import NestedBlockWrapper from '../core/NestedBlockWrapper'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({ adapter: new Adapter() })


const ctx = () => ({
  value_updated: sinon.spy(),
  redraw: sinon.spy(),
  block_toggled: sinon.spy(),
})


const field_def = {
  name:        'my_nested_block',
  description: 'My NestedBlock',
  type:        Otter.Fields.NestedBlock,
}
const field_def__optional = Object.assign({}, field_def, { optional: true })


const data_item = {
  __type: 'X',
  my_nested_block: {
    __type: 'Y',
    content: 'Hello',
  },
  some_other_field: 8,
}
const data_item__no_nested_block_data = {
  __type: 'X',
  some_other_field: 8,
}


function mk(field_def, containing_data_item, ctx_methods, children) {
  const Prov = PageDataContext.Provider
  return mount(
    <Prov value={ctx_methods}>
      <NestedBlockWrapper field_def={field_def}
                          containing_data_item={containing_data_item}>
        {children}
      </NestedBlockWrapper>
    </Prov>
  )
}


test('NestedBlock: renders title, ddtoggle', t => {
  const wrapper = mk(field_def, data_item, {}, [ ])
  t.is(1, wrapper.find('h4').length)
  t.is(1, wrapper.find('DDToggle').length)
  t.truthy(wrapper.find('h4').text().match(field_def.description))
})


test('NestedBlock: renders children when uncollapsed', t => {
  const context = ctx()
  const wrapper = mk(field_def, data_item, context, [
    <div className="nbw-child nbw-child-1" key="k1"></div>,
    <div className="nbw-child nbw-child-2" key="k2"></div>,
  ])
  wrapper.find('.nbw-toggle').prop('onClick')({
    currentTarget: {
      blur: sinon.spy(),
    },
  })
  wrapper.update()
  t.is(2, wrapper.find('.nbw-child').length)
  t.is(1, wrapper.find('.nbw-child-1').length)
  t.is(1, wrapper.find('.nbw-child-2').length)
})


test('NestedBlockWrapper: collapse toggle calls ctx redraw, block_toggled', t => {
  const context = ctx()
  const wrapper = mk(field_def, data_item, context, [
    <div className="nbw-child nbw-child-1" key="k1"></div>,
    <div className="nbw-child nbw-child-2" key="k2"></div>,
  ])
  wrapper.find('.nbw-toggle').prop('onClick')({
    currentTarget: {
      blur: sinon.spy(),
    },
  })
  t.true(context.redraw.calledOnce)
  t.true(context.block_toggled.calledOnce)
})


test('NestedBlockWrapper: when optional, renders Toggle', t => {
  const wrapper = mk(field_def__optional, data_item, {}, [ ])
  t.is(1, wrapper.find('Toggle').length)
})


test('NestedBlockWrapper: when optional, enable state respects initial presence/absence of data', t => {
  const wrapper__data    = mk(field_def__optional, data_item, {}, [ ])
  const wrapper__no_data = mk(field_def__optional, data_item__no_nested_block_data, {}, [ ])
  t.true(wrapper__data.find('Toggle').prop('checked'))
  t.false(wrapper__no_data.find('Toggle').prop('checked'))
})


test('NestedBlockWrapper: when optional, collapse toggle does nothing until enabled', t => {
  const context = ctx()
  const wrapper = mk(field_def__optional, data_item__no_nested_block_data, context, [
    <div className="nbw-child nbw-child-1" key="k1"></div>,
    <div className="nbw-child nbw-child-2" key="k2"></div>,
  ])
  const toggle_collapse = () => {
    wrapper.find('.nbw-toggle').prop('onClick')({
      currentTarget: {
        blur: sinon.spy(),
      },
    })
    wrapper.update()
  }

  // Initially disabled: collapse toggle doesn't work
  toggle_collapse()
  t.is(0, wrapper.find('.nbw-child').length)

  // After enable: collapse toggle works
  wrapper.find('Toggle').prop('onChange')({
    currentTarget: {
      blur: sinon.spy(),
      checked: true,
    },
  })
  wrapper.update()
  toggle_collapse()
  t.is(2, wrapper.find('.nbw-child').length)
})


test('NestedBlockWrapper: toggle_enabled calls ctx value_updated, redraw, block_toggled', t => {
  const context = ctx()
  const wrapper = mk(field_def__optional, data_item__no_nested_block_data, context, [ ])
  wrapper.find('Toggle').prop('onChange')({
    currentTarget: {
      blur: sinon.spy(),
      checked: true,
    },
  })
  wrapper.update()
  t.true(context.value_updated.calledOnce)
  t.true(context.redraw.calledOnce)
  t.true(context.block_toggled.calledOnce)
})

