import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
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


function mk_stubbed_block(data_item, blocks, extra_ctx_props) {
  return mount(<Block data_item={data_item} index={0}
                      draggable_component={stubs.func_stub([provided, snapshot])}
                      consumer_component={stubs.func_stub([{ blocks, ...extra_ctx_props }])}
                      field_renderer_component={stubs.Stub} />);
}


test('Block: get_drag_styles', t => {
  const while_dragging     = (new Block()).get_drag_styles(provided, { isDragging: true  });
  const while_not_dragging = (new Block()).get_drag_styles(provided, snapshot);

  t.deepEqual(['border', 'backgroundColor', 'color'], Object.keys(while_dragging));
  t.deepEqual(['color'], Object.keys(while_not_dragging));
});


test('Block: warning if invalid block type', t => {
  const wrapper = mk_stubbed_block(test_data(true)[0], [ ]);
  const exp = <h3 className='title is-4'>{`Unknown block type: '${test_data(true)[0].__type}'`}</h3>;
  t.is(true, wrapper.contains(exp));
});


test('Block: title is description or type', t => {
  const blocks_with_description = Otter.Utils.copy(test_blocks);
  blocks_with_description[0].description = 'A block';

  const block__type_title  = mk_stubbed_block(test_data(true)[0], test_blocks);
  const block__descr_title = mk_stubbed_block(test_data(true)[0], blocks_with_description);

  const has_type_title  = block__type_title.contains(<h3 className='title is-4'>{test_blocks[0].type}</h3>);
  const has_descr_title = block__descr_title.contains(<h3 className='title is-4'>{blocks_with_description[0].description}</h3>);

  t.is(true, has_type_title);
  t.is(true, has_descr_title);
});


test('Block: creates AddBlockBtn', t => {
  const block = mk_stubbed_block(test_data(true)[0], test_blocks);
  t.is(1, block.find('AddBlockBtn').length);
});


test('Block: delete btn calls ctx.remove_block(uid)', t => {
  let calls = [ ]
  const data = test_data(true);
  const block = mk_stubbed_block(data[0], test_blocks, {
    remove_block(uid) {
      calls.push(uid);
    },
  });

  block.find('.block-delete-btn').simulate('click');
  t.deepEqual([ data[0].__uid ], calls);
});


test('Block: passes data_item, ctx.blocks, is_top_level to RecursiveBlockRenderer', t => {
  const data  = test_data(true);
  const block = mk_stubbed_block(data[0], test_blocks);

  t.deepEqual({
    data_item:    data[0],
    block:        Otter.Utils.find_block(test_blocks, data[0].__type),
    is_top_level: true,
  }, stubs.Stub.last_props);
});

