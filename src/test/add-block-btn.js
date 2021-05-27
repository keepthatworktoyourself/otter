import test from 'ava'
import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
import AddBlockBtn from '../core/other/AddBlockBtn'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({ adapter: new Adapter() })


const blocks__simple = [
  {
    type: 'MyBlock',
  },
  {
    type: 'MyOtherBlock',
  },
  {
    type: 'MyHiddenBlock',
    hidden: true,
  },
]
const blocks__grouped = {
  group1: {
    name: 'First group',
    blocks: [ ],
  },
  group2: {
    name: 'Second group',
    blocks: [ ],
  },
}
const fake_ev = (attribute_return) => ({
  currentTarget: {
    getAttribute() {
      return attribute_return
    },
  },
})


function mk(index, blocks, popup_direction, suggest, context_methods) {
  return mount(<AddBlockBtn index={index}
                            blocks={blocks}
                            popup_direction={popup_direction}
                            suggest={suggest}
                            consumer_component={stubs.func_stub([{ blocks, ...context_methods }])} />)
}


test('AddBlockBtn: click to open', t => {
  const wrapper = mk(0, [ ], null, false)
  t.is(0, wrapper.find('.add-block-btn-menu').length)
  wrapper.find('button').prop('onClick')()
  wrapper.update()
  t.is(1, wrapper.find('.add-block-btn-menu').length)
})


test('AddBlockBtn: dropdown can go up or down', t => {
  const wrapper       = mk(0, [ ], null,   false)
  const wrapper__up   = mk(0, [ ], 'up',   false)
  const wrapper__down = mk(0, [ ], 'down', false)

  wrapper.find('button').prop('onClick')()
  wrapper__up.find('button').prop('onClick')()
  wrapper__down.find('button').prop('onClick')()
  wrapper.update()
  wrapper__up.update()
  wrapper__down.update()

  const dropdown       = wrapper.find('.add-block-btn-menu')
  const dropdown__up   = wrapper__up.find('.add-block-btn-menu')
  const dropdown__down = wrapper__down.find('.add-block-btn-menu')

  t.falsy(dropdown.prop('className').match('bottom-'))
  t.truthy(dropdown__up.prop('className').match('bottom-'))
  t.truthy(dropdown__down.prop('className').match('top-'))
})


test('AddBlockBtn: simple blocks: renders non-hidden dropdown items, call cb__select on click', t => {
  const wrapper = mk(0, blocks__simple, null, false)
  wrapper.find('button').prop('onClick')()
  wrapper.update()
  const items = wrapper.find('.add-block-btn-menu-item')
  const exp = blocks__simple.filter(b => b.hidden !== true)
  t.is(exp.length, items.length)
  t.is(wrapper.instance().cb__select, items.first().prop('onClick'))
})


test('AddBlockBtn: simple blocks: selecting an item closes the dropdown', t => {
  const wrapper = mk(0, blocks__simple, null, false, {
    add_item: () => { },
  })
  wrapper.find('button').prop('onClick')()
  wrapper.update()
  t.is(1, wrapper.find('.add-block-btn-menu').length)

  wrapper.find('.add-block-btn-menu-item').first().prop('onClick')(fake_ev('MyBlockType'))
  wrapper.update()
  t.is(0, wrapper.find('.add-block-btn-menu').length)
})


test('AddBlockBtn: simple blocks: selecting an item calls ctx.add_item', t => {
  const index = 13
  const context = {
    add_item: sinon.spy(),
  }
  const wrapper = mk(index, blocks__simple, null, false, context)
  wrapper.find('button').prop('onClick')()
  wrapper.update()
  wrapper.find('.add-block-btn-menu-item').first().prop('onClick')(fake_ev('AnotherBlockType'))
  t.true(context.add_item.calledOnce)
  t.deepEqual(['AnotherBlockType', index], context.add_item.firstCall.args)
})


test('AddBlockBtn: grouped blocks: cb__toggle opens *global* block picker', t => {
  const context = {
    open_block_picker: sinon.spy(),
  }
  const index = 17
  const wrapper = mk(index, blocks__grouped, null, false, context)
  wrapper.find('button').prop('onClick')()
  wrapper.update()

  t.is(0, wrapper.find('.add-block-btn-menu').length)
  t.true(context.open_block_picker.calledOnce)
  t.deepEqual([index], context.open_block_picker.firstCall.args)
})


test('AddBlockBtn: suggest prop -> helpful text on button', t => {
  const wrapper__suggest    = mk(0, [ ], null, true)
  const wrapper__no_suggest = mk(0, [ ], null, false)
  const exp_msg = 'Insert block'
  t.truthy(wrapper__suggest.find('button').text().match(exp_msg))
  t.falsy(wrapper__no_suggest.find('button').text().match(exp_msg))
})

