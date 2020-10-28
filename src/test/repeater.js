import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Repeater from '../core/Repeater';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';


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


const ctx = (overrides) => Object.assign(
  {},
  {
    value_updated: sinon.spy(),
    should_redraw: sinon.spy(),
    block_toggled: sinon.spy(),
    blocks: test_blocks(),
  },
  overrides
);


const DragDropContext  = 'Stub[stub="DragDropContext"]';
const RepeaterItem = 'Stub[stub="RepeaterItem"]';
const RecursiveBlockRenderer = 'Stub[stub="RBR"]';


function mk_stubbed(field_def, containing_data_item, ctx_methods) {
  return mount(<Repeater field_def={field_def}
                         containing_data_item={containing_data_item}
                         consumer_component={stubs.func_stub([{...ctx_methods}])}
                         repeater_item_component={stubs.Stub}
                         rbr_component={stubs.Stub}
                         drag_context_component={stubs.Stub}
                         droppable_component={stubs.func_stub([provided, snapshot])}
                         draggable_component={stubs.func_stub([provided, snapshot])} />);
}


test('Repeater: creates a Droppable (DnD context)', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  const dnd_context = wrapper.find(DragDropContext);
  t.is(1, wrapper.find('[droppableId]').length);
  t.is(wrapper.instance().cb__reorder, dnd_context.prop('onDragEnd'));
});


test('Repeater: renders RepeaterItems', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  t.is(test_data()[3].content_items.length, wrapper.find(RepeaterItem).length);
});


test('Repeater: props passed to RepeaterItems', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  const item = wrapper.find(RepeaterItem).first();
  t.is(0, item.prop('index'));
  t.is(`d-${wrapper.instance().uid}`, item.prop('dnd_context_id'));
  t.is(wrapper.instance().cb__delete, item.prop('cb__delete'));
});


test('Repeater: renders RecursiveBlockRenderer inside RepeaterItems, passes props', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  const item = wrapper.find(RepeaterItem).first();
  const rbr = item.find(RecursiveBlockRenderer);
  t.is(1, rbr.length);
  t.deepEqual(test_data()[3].content_items[0], rbr.prop('data_item'));
  t.deepEqual(test_blocks(), rbr.prop('blocks'));
});


test('Repater: renders Add btn', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  t.is(1, wrapper.find('.repeater-add-btn').length);
});


test('Repeater: does not render Add btn if has max children', t => {
  const f = Otter.Utils.copy(test_blocks()[3].fields[0]);
  f.max = 2;
  const wrapper = mk_stubbed(f, test_data()[3], ctx());
  t.is(0, wrapper.find('.repeater-add-btn').length);
});


test('Repeater: Add btn renders dropdown item for each nested_block_types', t => {
  const f = Otter.Utils.copy(test_blocks()[3].fields[0]);
  const wrapper = mk_stubbed(f, test_data()[3], ctx());
  const items = wrapper.find('.dropdown-item');
  t.deepEqual(f.nested_block_types, items.map(item => item.prop('data-nested_block-type')));
  t.is(wrapper.instance().cb__add, items.first().prop('onClick'));
});


const blocks__object_nested_block_types = [{
  type: 'MyBlock',
  fields: [
    {
      name: 'my_repeater',
      type: Otter.Fields.Repeater,
      nested_block_types: [
        {
          type: 'AAA',
          fields: [{
            name: 'aaa',
            type: Otter.Fields.TextInput,
          }],
        },
        {
          type: 'BBB',
          fields: [{
            name: 'bbb',
            type: Otter.Fields.TextArea,
          }],
        },
      ],
    },
  ],
}];
const data_item__object_nested_block_types = {
  __type: 'MyBlock',
  my_repeater: [
    {
      __type: 'BBB',
      bbb: 'A repeater entry',
    },
  ],
};


test('Repeater: Add btn supports nested_block_types objects as well as strings', t => {
  const f = blocks__object_nested_block_types[0].fields[0];
  const wrapper = mk_stubbed(f, data_item__object_nested_block_types, ctx({ blocks: blocks__object_nested_block_types }));
  const items = wrapper.find('.dropdown-item');
  t.deepEqual(['AAA', 'BBB'], items.map(item => item.prop('data-nested_block-type')));
  t.is(wrapper.instance().cb__add, items.first().prop('onClick'));
});


test('Repeater: Add btn when only 1 block type: immediately adds', t => {
  const data_item = { __type: 'B4' };
  const f = Otter.Utils.copy(test_blocks()[3].fields[0]);
  f.nested_block_types = [ 'AContentItem' ];
  const wrapper = mk_stubbed(f, data_item, ctx());
  const add_btn = wrapper.find('.repeater-add-btn button');

  t.is(0, wrapper.find(RepeaterItem).length);

  add_btn.prop('onClick')();
  wrapper.update();
  t.is(1, wrapper.find(RepeaterItem).length);
});


test('Repeater: Add btn click when only 1 block type: supports nested_block_types objects as well as strings', t => {
  const blocks = Otter.Utils.copy(blocks__object_nested_block_types);
  blocks[0].fields[0].nested_block_types.splice(1);   // Only 1 nested block type
  const data_item = { __type: 'MyBlock' };
  const f = blocks[0].fields[0];
  const wrapper = mk_stubbed(f, data_item, ctx({ blocks: blocks }));
  wrapper.find('.repeater-add-btn button').prop('onClick')();
  wrapper.update();
  t.is(1, wrapper.find(RepeaterItem).length);
});


test('Repeater: on Add btn click, if >1 nested_block_type, open submenu', t => {
  const data_item = { __type: 'B4' };
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], data_item, ctx());
  const add_btn = wrapper.find('.repeater-add-btn button');

  t.is(0, wrapper.find('.dropdown.is-active').length);

  add_btn.prop('onClick')();
  wrapper.update();
  t.is(0, wrapper.find('RepeaterItem').length);
  t.is(1, wrapper.find('.dropdown.is-active').length);
});


test('Repeater: cb__add: add menu item click adds item', t => {
  const data_item = { __type: 'B4' };
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], data_item, ctx());
  wrapper.find('.repeater-add-btn button').prop('onClick')();
  t.is(0, wrapper.find(RepeaterItem).length);

  const add_menu_items = wrapper.find('.dropdown-item');
  t.is(test_blocks()[3].fields[0].nested_block_types.length, add_menu_items.length);

  add_menu_items.first().prop('onClick')({
    currentTarget: {
      getAttribute() {
        return 'AnotherContentItem';
      },
    },
  });

  wrapper.update();
  t.is(1, wrapper.find(RepeaterItem).length);
});


test('Repeater: cb__add: supports nested_block_types as objects', t => {
  const f = blocks__object_nested_block_types[0].fields[0];
  const wrapper = mk_stubbed(f, data_item__object_nested_block_types, ctx({ blocks: blocks__object_nested_block_types }));
  wrapper.find('.repeater-add-btn button').prop('onClick')();
  const add_menu_items = wrapper.find('.dropdown-item');
  t.is(blocks__object_nested_block_types[0].fields[0].nested_block_types.length, add_menu_items.length);

  add_menu_items.first().prop('onClick')({
    currentTarget: {
      getAttribute() {
        return 'AAA';
      },
    },
  });
  wrapper.update();
  const item = wrapper.find(Repeater);
  t.is(1, item.length);
  t.deepEqual(f, item.prop('field_def'));
});


test('Repeater: when cb__delete called by a RepeaterItem, the item is removed', t => {
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], ctx());
  t.is(2, wrapper.find(RepeaterItem).length);

  wrapper.find(RepeaterItem).first().prop('cb__delete')(0);
  wrapper.update();
  t.is(1, wrapper.find(RepeaterItem).length);
});


test('Repeater: cb__delete calls ctx value_updated, should_redraw, block_toggled', t => {
  const context = ctx();
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], context);
  wrapper.find(RepeaterItem).first().prop('cb__delete')(0);
  t.true(context.value_updated.calledOnce);
  t.true(context.should_redraw.calledOnce);
  t.true(context.block_toggled.calledOnce);
});


// Reordering items
// ------------------------------------

test('Repeater: cb__reorder: no destination or no change, does nothing', t => {
  const context = ctx({
    value_updated: sinon.spy(),
  });
  const wrapper = mk_stubbed(test_blocks()[3].fields[0], test_data()[3], context);

  wrapper.instance().cb__reorder({ destination: false });
  wrapper.instance().cb__reorder({ source: false });
  wrapper.instance().cb__reorder({
    source:      { index: 6 },
    destination: { index: 6 },
  });

  wrapper.update();
  t.false(wrapper.instance().ctx.value_updated.called);
});


test('Repeater: cb__reorder: reorders items', t => {
  const context     = ctx();
  const data_item   = test_data()[3];
  const data_before = Otter.Utils.copy(data_item.content_items);
  const wrapper     = mk_stubbed(test_blocks()[3].fields[0], data_item, context);

  wrapper.instance().cb__reorder({
    source:      { index: data_item.content_items.length - 1 },
    destination: { index: 0 },
  });

  const instance = wrapper.instance();
  const data_after = instance.props.containing_data_item.content_items;

  t.true(context.value_updated.calledOnce);
  t.true(context.should_redraw.calledOnce);
  t.true(context.block_toggled.calledOnce);

  t.is(data_before.length, data_after.length);
  t.deepEqual(data_before[data_before.length - 1], data_after[0]);
});

