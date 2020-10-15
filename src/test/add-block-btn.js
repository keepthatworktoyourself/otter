import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import AddBlockBtn from '../core/other/AddBlockBtn';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';


configure({ adapter: new Adapter() });


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
];
const blocks__grouped = {
  group1: {
    name: 'First group',
    blocks: [ ],
  },
  group2: {
    name: 'Second group',
    blocks: [ ],
  },
};
const fake_ev = (attribute_return) => ({
  currentTarget: {
    getAttribute() {
      return attribute_return;
    },
  },
});


function mk(index, blocks, popup_direction, suggest, context_methods) {
  return shallow(<AddBlockBtn index={index}
                              blocks={blocks}
                              popup_direction={popup_direction}
                              suggest={suggest}
                              consumer_component={stubs.func_stub([{ blocks, ...context_methods }])} />);
}


test('AddBlockBtn: renders a dropdown, uses popup_direction prop', t => {
  const wrapper       = mk(0, [ ], null,   false).dive();
  const wrapper__up   = mk(0, [ ], 'up',   false).dive();
  const wrapper__down = mk(0, [ ], 'down', false).dive();

  const dropdown       = wrapper.find('.dropdown');
  const dropdown__up   = wrapper__up.find('.dropdown');
  const dropdown__down = wrapper__down.find('.dropdown');

  t.falsy(dropdown.prop('className').match('is-up'));
  t.truthy(dropdown__up.prop('className').match('is-up'));
  t.falsy(dropdown__down.prop('className').match('is-up'));
});


test('AddBlockBtn: renders dropdown trigger button calling cb__toggle on click', t => {
  const wrapper = mk(0, [ ], null, false);
  const dd_trigger = wrapper.dive().find('.dropdown-trigger');
  const btn = dd_trigger.find('.button');

  t.is(1, dd_trigger.length);
  t.is(1, btn.length);

  t.is(wrapper.instance().cb__toggle, btn.prop('onClick'));
});


test('AddBlockBtn: dropdown is initially closed', t => {
  const wrapper = mk(0, [ ], null, false).dive();
  t.false(wrapper.find('.dropdown').is('.is-active'));
});


test('AddBlockBtn: simple blocks: renders non-hidden dropdown items, call cb__select on click', t => {
  const wrapper = mk(0, blocks__simple, null, false);
  const items = wrapper.dive().find('.dropdown-item');
  const exp = blocks__simple.filter(b => b.hidden !== true);
  t.is(exp.length, items.length);
  t.is(wrapper.instance().cb__select, items.first().prop('onClick'));
});


test('AddBlockBtn: simple blocks: cb__toggle toggles dropdown', t => {
  const wrapper = mk(0, blocks__simple, null, false);
  wrapper.dive().find('.dropdown-trigger .button').prop('onClick')();
  wrapper.update();
  t.true(wrapper.dive().find('.dropdown').is('.is-active'));

  wrapper.dive().find('.dropdown-trigger .button').prop('onClick')();
  wrapper.update();
  t.false(wrapper.dive().find('.dropdown').is('.is-active'));
});


test('AddBlockBtn: simple blocks: selecting an item closes the dropdown', t => {
  const wrapper = mk(0, blocks__simple, null, false, {
    add_item: () => { },
  });
  wrapper.dive().find('.dropdown-trigger .button').prop('onClick')();
  wrapper.update();
  t.true(wrapper.dive().find('.dropdown').is('.is-active'));

  wrapper.dive().find('.dropdown-item').first().prop('onClick')(fake_ev('MyBlockType'));
  wrapper.update();
  t.false(wrapper.dive().find('.dropdown').is('.is-active'));
});


test('AddBlockBtn: simple blocks: selecting an item calls ctx.add_item', t => {
  const index = 13;
  const context = {
    add_item: sinon.spy(),
  };
  const wrapper = mk(index, blocks__simple, null, false, context);
  wrapper.dive().find('.dropdown-item').first().prop('onClick')(fake_ev('AnotherBlockType'));
  t.true(context.add_item.calledOnce);
  t.deepEqual(['AnotherBlockType', index], context.add_item.firstCall.args);
});


test('AddBlockBtn: grouped blocks: cb__toggle opens global block picker', t => {
  const context = {
    open_block_picker: sinon.spy(),
  };
  const index = 17;
  const wrapper = mk(index, blocks__grouped, null, false, context);
  const btn = wrapper.dive().find('.dropdown-trigger .button');
  btn.prop('onClick')();
  wrapper.update();

  t.false(wrapper.dive().find('.dropdown').is('.is-active'));
  t.true(context.open_block_picker.calledOnce);
  t.deepEqual([index], context.open_block_picker.firstCall.args);
});


test('AddBlockBtn: btn includes a message when suggest is true', t => {
  const wrapper__suggest    = mk(0, [ ], null, true).dive();
  const wrapper__no_suggest = mk(0, [ ], null, false).dive();
  const exp_msg = 'Add a block to get started';
  t.truthy(wrapper__suggest.find('.button').text().match(exp_msg));
  t.falsy(wrapper__no_suggest.find('.button').text().match(exp_msg));
});

