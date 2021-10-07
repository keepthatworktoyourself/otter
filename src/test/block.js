import test from 'ava'
import React from 'react'
import {shallow, mount, configure} from 'enzyme'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
import PageDataContext from '../core/PageDataContext'
import Block from '../core/Block'
import BlockDeleteBtn from '../core/other/BlockDeleteBtn'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({adapter: new Adapter()})


const provided = {
  innerRef:       null,
  draggableProps: {
    style: {color: 'yellow'},
  },
}
const snapshot = {
  isDragging: false,
}


function mk(blocks, data_item, index, cb__delete, extra_ctx_props, block_numbers) {
  const Prov = PageDataContext.Provider
  return mount(
    <Prov value={{blocks, ...extra_ctx_props}}>
      <Block data_item={data_item}
             index={index}
             block_numbers={block_numbers}
             cb__delete={cb__delete}
             draggable_component={stubs.func_stub([provided, snapshot])}
             recursive_renderer_component={stubs.mk_stub('RecursiveRenderer')} />
    </Prov>,
  )
}


test('Block: warning if invalid block type', t => {
  const wrapper = mk([], test_data()[0])
  t.truthy(wrapper.text().match(/Unknown block type/))
})


test('Block: renders', t => {
  const blocks = test_blocks()
  const blocks__with_descr = Otter.Utils.copy(blocks)
  blocks__with_descr[0].description = 'A block'

  const block__with_type_only = mk(blocks, test_data()[0])
  const block__with_descr     = mk(blocks__with_descr, test_data()[0])

  const exp__type_only = Otter.Utils.humanify_str(test_blocks()[0].type)
  const exp__with_descr = 'A block'

  t.truthy(block__with_type_only.text().match(exp__type_only))
  t.truthy(block__with_descr.text().match(exp__with_descr))
})


test('Block: renders index if block_numbers true', t => {
  const blocks = test_blocks()
  const index = 0
  const block = mk(blocks, test_data()[0], index, null, {}, true)
  t.is(`${index + 1}`, block.find('h3 span').first().text())
})


test('Block: creates AddBlockBtn', t => {
  const block = mk(test_blocks(), test_data()[0])
  t.is(1, block.find('AddBlockBtn').length)
})


test('Block: delete btn calls ctx.remove_block(uid)', t => {
  const cb__delete = sinon.spy()
  const block = mk(test_blocks(), test_data()[0], 67, cb__delete, { })

  block.findWhere(node => node.type() === BlockDeleteBtn).prop('cb__delete')()
  t.deepEqual([67], cb__delete.lastCall.args)
})


test('Block: passes data_item, ctx.blocks, is_top_level to RecursiveBlockRenderer', t => {
  const data  = test_data()
  const block = mk(test_blocks(), data[0])
  const recursive_renderer = block.find('[type="RecursiveRenderer"]')

  t.deepEqual(
    {
      data_item:    data[0],
      blocks:       test_blocks(),
      is_top_level: true,
    },
    {
      data_item:    recursive_renderer.prop('data_item'),
      blocks:       recursive_renderer.prop('blocks'),
      is_top_level: recursive_renderer.prop('is_top_level'),
    },
  )
})

