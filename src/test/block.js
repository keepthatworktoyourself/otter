import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import Block from '../core/Block';
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


function mk_stubbed_block(blocks, data_item, index, cb__delete, extra_ctx_props) {
  return mount(<Block data_item={data_item} index={0}
                      index={index}
                      cb__delete={cb__delete}
                      draggable_component={stubs.func_stub([provided, snapshot])}
                      consumer_component={stubs.func_stub([{ blocks, ...extra_ctx_props }])}
                      recursive_renderer_component={stubs.Stub} />);
}


test('Block: get_drag_styles', t => {
  const while_dragging     = (new Block()).get_drag_styles(provided, { isDragging: true  });
  const while_not_dragging = (new Block()).get_drag_styles(provided, snapshot);

  t.deepEqual(Object.keys(provided.draggableProps.style), Object.keys(while_dragging));
  t.deepEqual(Object.keys(provided.draggableProps.style), Object.keys(while_not_dragging));
  // Block doesn't currently use any custom drag styles
});


test('Block: warning if invalid block type', t => {
  const wrapper = mk_stubbed_block([ ], test_data()[0]);
  t.truthy(wrapper.find('.title').text().match(/Unknown block type/));
});


test('Block: renders', t => {
  const blocks = test_blocks();
  const blocks__with_descr = Object.assign(Otter.Utils.copy(blocks), {
    description: 'A block',
  });

  const block__with_type_only = mk_stubbed_block(blocks, test_data()[0]);
  const block__with_descr     = mk_stubbed_block(blocks__with_descr, test_data()[0]);

  t.truthy(block__with_type_only.find('h3.title').text().match(test_blocks()[0].type));
  t.truthy(block__with_descr.find('h3.title').text().match(blocks__with_descr[0].description));
});


test('Block: creates AddBlockBtn', t => {
  const block = mk_stubbed_block(test_blocks(), test_data()[0]);
  t.is(1, block.find('AddBlockBtn').length);
});


test('Block: delete btn calls ctx.remove_block(uid)', t => {
  const cb__delete = sinon.spy();
  const block = mk_stubbed_block(test_blocks(), test_data()[0], 67, cb__delete, { });

  block.find('.block-delete-btn').prop('onClick')();
  t.deepEqual([67], cb__delete.lastCall.args);
});


test('Block: passes data_item, ctx.blocks, is_top_level to RecursiveBlockRenderer', t => {
  const data  = test_data();
  const block = mk_stubbed_block(test_blocks(), data[0]);

  t.deepEqual(
    {
      data_item:    data[0],
      blocks:       test_blocks(),
      is_top_level: true,
    },
    stubs.Stub.last_props
  );
});

