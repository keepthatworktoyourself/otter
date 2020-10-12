import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Editor from '../core/Editor';
import Block from '../core/Block';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';
import sinon from 'sinon';


configure({ adapter: new Adapter() });


const provided = {
  innerRef: null,
  draggableProps: {
    style: { color: 'yellow' },
  },
};
const snapshot = {
  isDragging: false,
};


function mk_stubbed(load_state, blocks, data_items, when_to_save) {
  return shallow(<Editor load_state={load_state}
                         data={data_items}
                         blocks={blocks}
                         save={when_to_save}
                         drag_context_component={stubs.Stub}
                         droppable_component={stubs.func_stub([provided, snapshot])} />);
}


test('Editor: blog_toggled calls delegate.block_toggled if present', t => {
  const e = new Editor();
  const f = new Editor();

  let called = 0;

  e.props = { delegate: { block_toggled() { called += 1; } } };
  f.props = { };

  e.block_toggled();
  t.is(1, called);

  f.block_toggled();
  t.is(1, called);
});


test('Editor: do_save_on_input saves if Save is OnInput', t => {
  const [e, f] = [new Editor(), new Editor()];
  let [e_saved, f_saved] = [false, false];

  e.save = () => e_saved = true;
  f.save = () => f_saved = true;

  e.props = { save: Otter.Save.OnInput               };
  f.props = { save: Otter.Save.WhenSaveButtonClicked };

  e.do_save_on_input();
  f.do_save_on_input();

  t.is(true, e_saved);
  t.is(false, f_saved);
});


test('Editor: save calls delegate', t => {
  const e = new Editor();
  let saved = false;
  e.props = { delegate: { save() { saved = true } } };
  e.save();
  t.is(true, saved);
});


test('Editor: msg on load_state error or unset', t => {
  const wrapper = shallow(<Editor />);
  t.truthy(wrapper.find('.otter-load-error').text().match(/Error loading post data/));
});


test ('Editor: msg on load_state loading', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loading} />);
  t.truthy(wrapper.find('.otter-load-error').text().match(/Loading\.\.\./));
});


test('Editor: msg on unknown load_state', t => {
  const wrapper = shallow(<Editor load_state='hello' />);
  t.truthy(wrapper.find('.otter-load-error').text().match(/Unknown load state: hello/));
});


test('Editor: renders post data container on load_state loaded', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loaded} />);
  t.true(wrapper.exists('.container'));
});


test('Editor: provides a context', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, [ ], [ ], Otter.Save.OnInput);
  t.true(wrapper.exists('[stub="ContextProvider"]'));
});


test('Editor: creates a DnD context', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, [ ], [ ], Otter.Save.OnInput);
  const dnd_context = wrapper.find('[stub="DragDropContext"]');
  t.true(wrapper.exists('[stub="DragDropContext"]'));
  t.true(wrapper.exists('[droppableId]'));
  t.is(wrapper.instance().cb__reorder, dnd_context.prop('onDragEnd'));
});


test('Editor: renders save button when Save is WhenSaveButtonClicked (also by default)', t => {
  const e0 = shallow(<Editor load_state={Otter.State.Loaded} />);
  const e1 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.WhenSaveButtonClicked} />);
  const e2 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.OnInput} />);
  t.is(true, e0.exists('.save-button'));
  t.is(true, e1.exists('.save-button'));
  t.is(false, e2.exists('.save-button'));
});


test('Editor: renders a Block for each data item', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  const droppable = wrapper.find('[droppableId]');
  t.is(test_data().length, droppable.dive().find('Block').length);
});


test('Editor: passes props to Blocks', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  const droppable = wrapper.find('[droppableId]');
  const items = droppable.dive().find('Block');
  const first = items.first();

  t.deepEqual(Otter.Utils.upto(test_data().length), items.map(b => b.prop('index')));
  t.deepEqual(test_data()[0], first.prop('data_item'));
  t.is(wrapper.instance().delete_item, first.prop('cb__delete'));
});


test('Editor: item is deleted when block cb__delete called', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  const droppable = wrapper.find('[droppableId]');
  const block = droppable.dive().find('Block').first();

  block.prop('cb__delete')(0);
  wrapper.update();
  t.is(test_data().length - 1, wrapper.find('[droppableId]').dive().find('Block').length);
});


test('Editor: add_item adds an item at end or specified index', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  const droppable = wrapper.find('[droppableId]');
  const block = droppable.dive().find('Block').first();

  wrapper.instance().add_item('AnotherContentItem');
  wrapper.instance().add_item('OneMoreContentItem', 2);

  wrapper.update();
  const blocks = wrapper.find('[droppableId]').dive().find('Block');
  t.is(test_data().length + 2, blocks.length);
  t.is('AnotherContentItem', blocks.last().prop('data_item').__type);
  t.is('OneMoreContentItem', blocks.at(2).prop('data_item').__type);
});


// Add block btn
// ------------------------------------

test('Editor: renders AddBlockBtn', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  const wrapper__no_data = mk_stubbed(Otter.State.Loaded, test_blocks(), [ ], Otter.Save.OnInput);
  const addblockbtn = wrapper.find('AddBlockBtn');
  const addblockbtn__no_data = wrapper__no_data.find('AddBlockBtn');
  t.is(1, addblockbtn.length);

  t.deepEqual(
    {
      blocks: test_blocks(),
      index: test_data().length,
      suggest: false,
      popup_direction: 'up',
    },
    addblockbtn.props()
  );
  t.is(true, addblockbtn__no_data.prop('suggest'));
  t.is('down', addblockbtn__no_data.prop('popup_direction'));
});


// Reordering items
// ------------------------------------

test('Editor: cb__reorder: no destination or no change, does nothing', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  sinon.spy(wrapper.instance().ctx, 'value_updated');

  wrapper.instance().cb__reorder({ destination: false });
  wrapper.instance().cb__reorder({ source: false });
  wrapper.instance().cb__reorder({
    source:      { index: 6 },
    destination: { index: 6 },
  });

  wrapper.update();
  t.false(wrapper.instance().ctx.value_updated.called);
});


test('Editor: cb__reorder: reorders items', t => {
  const wrapper = mk_stubbed(Otter.State.Loaded, test_blocks(), test_data(), Otter.Save.OnInput);
  sinon.spy(wrapper.instance().ctx, 'value_updated');

  wrapper.instance().cb__reorder({
    source:      { index: test_data().length - 1 },
    destination: { index: 0 },
  });

  const data_exported = wrapper.instance().get_data();
  const n_exported = data_exported.length;
  const n_originally = test_data().length;
  t.true(wrapper.instance().ctx.value_updated.calledOnce);
  t.true(data_exported[0].__type !== data_exported[n_exported - 1].__type);
  t.is(n_originally, n_exported);
  t.deepEqual(test_data()[n_originally - 1], data_exported[0]);
});


// get_data
// ------------------------------------

test('Editor: get_data exports data', t => {
  const e = new Editor({
    blocks:     test_blocks(),
    data: test_data(),
  });

  t.deepEqual(test_data(), e.get_data());
});


test('Editor: get_data removes null, undefined, empty string items', t => {
  [null, undefined, ''].forEach(value_should_be_removed => {
    const data_items = test_data();
    data_items[1].text = value_should_be_removed;

    const e = new Editor({
      blocks: test_blocks(),
      data:   data_items,
    });

    const exp = test_data();
    delete exp[1].text;

    t.deepEqual(exp, e.get_data());
  });
});


test('Editor: get_data removes items prefixed with __ (except __type)', t => {
  const blocks = [{
    type: 'MyBlock',
    description: 'My block',
    fields: [
      { name: 'title',     type: Otter.Fields.TextInput },
      { name: '__illegal', type: Otter.Fields.TextInput },
    ],
  }];
  const data_items = [{
    __type:    'MyBlock',
    title:     'Hi there',
    __illegal: 'Remove this',
  }];
  const exp = Otter.Utils.copy(data_items);
  delete exp[0].__illegal;

  const e = new Editor({ blocks, data: data_items });
  t.deepEqual(exp, e.get_data());
});


test('Editor: get_data respects optional/__enabled_subblocks', t => {
  const blocks = test_blocks();
  const block__subblock = blocks[2];
  const block__repeater = blocks[3];

  block__subblock.fields[0].optional = true;
  block__repeater.fields[0].optional = true;

  const data__subblock__disabled = [{
    __type: 'B3',
    __enabled_subblocks: { content_item: false },
    content_item: { __type: 'AContentItem' },
  }];
  const data__repeater__disabled = [{
    __type: 'B4',
    __enabled_subblocks: { content_items: false },
    content_items: [{ __type: 'AnotherContentItem' }],
  }];

  const data__subblock__enabled = Otter.Utils.copy(data__subblock__disabled);
  const data__repeater__enabled = Otter.Utils.copy(data__repeater__disabled);
  data__subblock__enabled[0].__enabled_subblocks = { content_item: true };
  data__repeater__enabled[0].__enabled_subblocks = { content_items: true };

  const exp__subblock__disabled = [{ __type: 'B3' }];
  const exp__repeater__disabled = [{ __type: 'B4' }];
  const exp__subblock__enabled  = Otter.Utils.copy(data__subblock__enabled);
  const exp__repeater__enabled  = Otter.Utils.copy(data__repeater__enabled);
  delete exp__subblock__enabled[0].__enabled_subblocks;
  delete exp__repeater__enabled[0].__enabled_subblocks;

  const e__subblock__disabled = new Editor({ blocks, data: data__subblock__disabled });
  const e__repeater__disabled = new Editor({ blocks, data: data__repeater__disabled });
  const e__subblock__enabled  = new Editor({ blocks, data: data__subblock__enabled });
  const e__repeater__enabled  = new Editor({ blocks, data: data__repeater__enabled });

  t.deepEqual(exp__subblock__disabled, e__subblock__disabled.get_data());
  t.deepEqual(exp__repeater__disabled, e__repeater__disabled.get_data());
  t.deepEqual(exp__subblock__enabled,  e__subblock__enabled.get_data());
  t.deepEqual(exp__repeater__enabled,  e__repeater__enabled.get_data());
});

