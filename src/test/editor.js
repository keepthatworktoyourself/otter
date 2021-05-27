import test from 'ava'
import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Editor from '../core/Editor'
import Block from '../core/Block'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'
import sinon from 'sinon'


configure({ adapter: new Adapter() })


const provided = {
  innerRef: null,
  draggableProps: {
    style: { color: 'yellow' },
  },
}
const snapshot = {
  isDragging: false,
}


function mk(load_state, blocks, data_items, when_to_save) {
  return mount(<Editor load_state={load_state}
                       data={data_items}
                       blocks={blocks}
                       save={when_to_save}
                       drag_context_component={stubs.mk_stub('DragContext')}
                       provider_component={stubs.mk_stub('ContextProvider')}
                       droppable_component={stubs.func_stub([provided, snapshot])}
                       block_component={stubs.mk_stub('Block')} />)
}


function deep_equal_ignoring_uids(t, _a, _b) {
  const a = Otter.Utils.copy(_a)
  const b = Otter.Utils.copy(_b)

  const remove_uid = (item) => { delete item.__uid }

  Otter.Utils.iterate_data(a, remove_uid)
  Otter.Utils.iterate_data(b, remove_uid)

  return t.deepEqual(a, b)
}


test('Editor: blog_toggled calls delegate.block_toggled if present', t => {
  const e = new Editor()
  const f = new Editor()

  let called = 0

  e.props = { delegate: { block_toggled() { called += 1 } } }
  f.props = { }

  e.block_toggled()
  t.is(1, called)

  f.block_toggled()
  t.is(1, called)
})


test('Editor: do_save_on_input saves if Save is OnInput', t => {
  const [e, f] = [new Editor(), new Editor()]
  let [e_saved, f_saved] = [false, false]

  e.save = () => e_saved = true
  f.save = () => f_saved = true

  e.props = { save: Otter.Save.OnInput               }
  f.props = { save: Otter.Save.OnClick }

  e.do_save_on_input()
  f.do_save_on_input()

  t.is(true, e_saved)
  t.is(false, f_saved)
})


test('Editor: save calls delegate', t => {
  const e = new Editor()
  let saved = false
  e.props = { delegate: { save() { saved = true } } }
  e.save()
  t.is(true, saved)
})


test('Editor: msg on load_state error or unset', t => {
  const wrapper = shallow(<Editor />)
  t.truthy(wrapper.find('.otter-load-error').text().match(/Error loading post data/))
})


test ('Editor: msg on load_state loading', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loading} />)
  t.truthy(wrapper.find('.otter-load-error').text().match(/Loading\.\.\./))
})


test('Editor: msg on unknown load_state', t => {
  const wrapper = shallow(<Editor load_state='hello' />)
  t.truthy(wrapper.find('.otter-load-error').text().match(/Unknown load state: hello/))
})


test('Editor: renders post data container on load_state loaded', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loaded} />)
  t.true(wrapper.exists('.container'))
})


test('Editor: provides a context', t => {
  const wrapper = mk(Otter.State.Loaded, [ ], [ ], Otter.Save.OnInput)
  const result = wrapper.find('[type="ContextProvider"]')
  t.true(wrapper.exists('[type="ContextProvider"]'))
})


test('Editor: creates a DnD context', t => {
  const wrapper = mk(Otter.State.Loaded, [ ], [ ], Otter.Save.OnInput)
  const dnd_context = wrapper.find('[type="DragContext"]')
  t.true(wrapper.exists('[type="DragContext"]'))
  t.true(wrapper.exists('[droppableId]'))
  t.is(wrapper.instance().cb__reorder, dnd_context.prop('onDragEnd'))
})


test('Editor: renders save button when Save is OnClick (also by default)', t => {
  const e0 = shallow(<Editor load_state={Otter.State.Loaded} />)
  const e1 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.OnClick} />)
  const e2 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.OnInput} />)
  t.is(true, e0.exists('.save-button'))
  t.is(true, e1.exists('.save-button'))
  t.is(false, e2.exists('.save-button'))
})


test('Editor: ensures data items have uids', t => {
  const data = test_data()
  const wrapper = mk(Otter.State.Loaded, test_blocks(), data, Otter.Save.OnInput)
  t.true(data[0].__uid !== undefined)
})


test('Editor: ensures display_ifs are arrays', t => {
  const blocks = test_blocks()
  blocks[1].fields[0].display_if = {
    sibling: 'test',
    matches: 'muffins',
  }
  const wrapper = mk(Otter.State.Loaded, blocks, test_data(), Otter.Save.OnInput)
  t.true(blocks[1].fields[0].display_if.constructor === Array)
})


test('Editor: renders a Block for each data item', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  const droppable = wrapper.find('[droppableId]')
  t.is(test_data().length, droppable.find('[type="Block"]').length)
})


test('Editor: passes props to Blocks', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  const droppable = wrapper.find('[droppableId]')
  const items = droppable.find('[type="Block"]')
  const first = items.first()

  t.deepEqual(Otter.Utils.upto(test_data().length), items.map(b => b.prop('index')))
  t.is(false, first.prop('block_numbers'))
  deep_equal_ignoring_uids(t, test_data()[0], first.prop('data_item'))
  t.is(wrapper.instance().delete_item, first.prop('cb__delete'))
})


test('Editor: item is deleted when block cb__delete called', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  const droppable = wrapper.find('[droppableId]')
  const block = droppable.find('[type="Block"]').first()

  block.prop('cb__delete')(0)
  wrapper.update()
  t.is(test_data().length - 1, wrapper.find('[droppableId]').find('[type="Block"]').length)
})


test('Editor: add_item adds an item at end or specified index', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  const droppable = wrapper.find('[droppableId]')
  const block = droppable.find('[type="Block"]').first()

  wrapper.instance().add_item('AnotherContentItem')
  wrapper.instance().add_item('OneMoreContentItem', 2)

  wrapper.update()
  const blocks = wrapper.find('[droppableId]').find('[type="Block"]')
  t.is(test_data().length + 2, blocks.length)
  t.is('AnotherContentItem', blocks.last().prop('data_item').__type)
  t.is('OneMoreContentItem', blocks.at(2).prop('data_item').__type)
})


// Add block btn
// ------------------------------------

test('Editor: renders AddBlockBtn', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  const wrapper__no_data = mk(Otter.State.Loaded, test_blocks(), [ ], Otter.Save.OnInput)
  const addblockbtn = wrapper.find('AddBlockBtn')
  const addblockbtn__no_data = wrapper__no_data.find('AddBlockBtn')
  t.is(1, addblockbtn.length)

  t.deepEqual(
    {
      blocks: test_blocks(),
      index: test_data().length,
      suggest: false,
      popup_direction: 'up',
    },
    addblockbtn.props()
  )
  t.is(true, addblockbtn__no_data.prop('suggest'))
  t.is('down', addblockbtn__no_data.prop('popup_direction'))
})


// Reordering items
// ------------------------------------

test('Editor: cb__reorder: no destination or no change, does nothing', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  sinon.spy(wrapper.instance().ctx, 'value_updated')

  wrapper.instance().cb__reorder({ destination: false })
  wrapper.instance().cb__reorder({ source: false })
  wrapper.instance().cb__reorder({
    source:      { index: 6 },
    destination: { index: 6 },
  })

  wrapper.update()
  t.false(wrapper.instance().ctx.value_updated.called)
})


test('Editor: cb__reorder: reorders items', t => {
  const wrapper = mk(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput)
  sinon.spy(wrapper.instance().ctx, 'value_updated')

  wrapper.instance().cb__reorder({
    source:      { index: test_data().length - 1 },
    destination: { index: 0 },
  })

  const data_exported = wrapper.instance().get_data()
  const n_exported = data_exported.length
  const n_originally = test_data().length
  t.true(wrapper.instance().ctx.value_updated.calledOnce)
  t.true(data_exported[0].__type !== data_exported[n_exported - 1].__type)
  t.is(n_originally, n_exported)
  t.deepEqual(test_data()[n_originally - 1], data_exported[0])
})


// get_data
// ------------------------------------

test('Editor: get_data exports data', t => {
  const e = new Editor({
    blocks: test_blocks(),
    data:   test_data(),
  })

  t.deepEqual(test_data(), e.get_data())
})


test('Editor: get_data strips out null, undefined, empty string, empty array field values', t => {
  [null, undefined, ''].forEach(value_should_be_removed => {
    const data_items = test_data()
    data_items[1].test_remove_item = value_should_be_removed

    t.deepEqual(test_data(), new Editor({
      blocks: test_blocks(),
      data:   data_items,
    }).get_data())
  })

  const data_items = test_data()
  data_items[3].content_items = [ ]

  const exp = test_data()
  delete exp[3].content_items

  t.deepEqual(exp, new Editor({
    blocks: test_blocks(),
    data:   data_items,
  }).get_data())
})


test('Editor: get_data removes fields prefixed with __ (except __type)', t => {
  const blocks = [{
    type: 'MyBlock',
    description: 'My block',
    fields: [
      { name: 'title',     type: Otter.Fields.TextInput },
      { name: '__illegal', type: Otter.Fields.TextInput },
    ],
  }]
  const data_items = [{
    __type:    'MyBlock',
    title:     'Hi there',
    __illegal: 'Remove this',
  }]
  const exp = Otter.Utils.copy(data_items)
  delete exp[0].__illegal

  const e = new Editor({ blocks, data: data_items })
  t.deepEqual(exp, e.get_data())
})


test('Editor: get_data removes non-top-level items that have only __type', t => {
  const data_items = [
    { __type: 'B1' },
    { __type: 'B2', text: 'hello' },
    { __type: 'B3', content_item: { __type: 'AContentItem' } },
    { __type: 'B3', content_item: { __type: 'AContentItem', f: 'x' } },
    { __type: 'B4', content_items: [{ __type: 'AnotherContentItem' }] },
    { __type: 'B4', content_items: [{ __type: 'AnotherContentItem', f: 'x' }] },
  ]
  const exp = [
    { __type: 'B1' },
    { __type: 'B2', text: 'hello' },
    { __type: 'B3' },
    { __type: 'B3', content_item: { __type: 'AContentItem', f: 'x' } },
    { __type: 'B4', content_items: [{ __type: 'AnotherContentItem' }] },    // Items in repeaters are kept
    { __type: 'B4', content_items: [{ __type: 'AnotherContentItem', f: 'x' }] },
  ]
  t.deepEqual(exp, new Editor({
    blocks: test_blocks(),
    data:   data_items,
  }).get_data())
})


test('Editor: get_data respects optional/__enabled_nested_blocks', t => {
  const blocks = test_blocks()
  const block__nested_block = blocks[2]
  const block__repeater = blocks[3]

  block__nested_block.fields[0].optional = true
  block__repeater.fields[0].optional = true

  const data__nested_block__disabled = [{
    __type: 'B3',
    __enabled_nested_blocks: { content_item: false },
    content_item: { __type: 'AContentItem', f: 'F' },
  }]
  const data__repeater__disabled = [{
    __type: 'B4',
    __enabled_nested_blocks: { content_items: false },
    content_items: [{ __type: 'AnotherContentItem', f: 'F' }],
  }]

  const data__nested_block__enabled = Otter.Utils.copy(data__nested_block__disabled)
  const data__repeater__enabled = Otter.Utils.copy(data__repeater__disabled)
  data__nested_block__enabled[0].__enabled_nested_blocks = { content_item: true }
  data__repeater__enabled[0].__enabled_nested_blocks = { content_items: true }

  const exp__nested_block__disabled = [{ __type: 'B3' }]
  const exp__repeater__disabled = [{ __type: 'B4' }]
  const exp__nested_block__enabled  = Otter.Utils.copy(data__nested_block__enabled)
  const exp__repeater__enabled  = Otter.Utils.copy(data__repeater__enabled)
  delete exp__nested_block__enabled[0].__enabled_nested_blocks
  delete exp__repeater__enabled[0].__enabled_nested_blocks

  const e__nested_block__disabled = new Editor({ blocks, data: data__nested_block__disabled })
  const e__repeater__disabled = new Editor({ blocks, data: data__repeater__disabled })
  const e__nested_block__enabled  = new Editor({ blocks, data: data__nested_block__enabled })
  const e__repeater__enabled  = new Editor({ blocks, data: data__repeater__enabled })

  t.deepEqual(exp__nested_block__disabled, e__nested_block__disabled.get_data())
  t.deepEqual(exp__repeater__disabled, e__repeater__disabled.get_data())
  t.deepEqual(exp__nested_block__enabled,  e__nested_block__enabled.get_data())
  t.deepEqual(exp__repeater__enabled,  e__repeater__enabled.get_data())
})

