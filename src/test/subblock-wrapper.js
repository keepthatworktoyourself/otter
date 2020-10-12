import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import SubBlockWrapper from '../core/SubBlockWrapper';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';


configure({ adapter: new Adapter() });


const ctx = () => ({
  value_updated: sinon.spy(),
  should_redraw: sinon.spy(),
  block_toggled: sinon.spy(),
});


const field_def = {
  name:        'my_subblock',
  description: 'My SubBlock',
  type:        Otter.Fields.SubBlock,
};
const field_def__optional = Object.assign({}, field_def, { optional: true });


const data_item = {
  __type: 'X',
  my_subblock: {
    __type: 'Y',
    content: 'Hello',
  },
  some_other_field: 8,
};
const data_item__no_subblock_data = {
  __type: 'X',
  some_other_field: 8,
};


function mk_stubbed(field_def, containing_data_item, ctx_methods, children) {
  return shallow(
    <SubBlockWrapper field_def={field_def}
                     containing_data_item={containing_data_item}
                     consumer_component={stubs.func_stub([{...ctx_methods}])}>
      {children}
    </SubBlockWrapper>
  );
}


test('SubBlock: renders title, ddtoggle', t => {
  const wrapper = mk_stubbed(field_def, data_item, {}, []);
  t.is(1, wrapper.dive().find('h4.title').length);
  t.is(1, wrapper.dive().find('DDToggle').length);
  t.truthy(wrapper.dive().find('h4.title').text().match(field_def.description));
});


test('SubBlock: renders children when uncollapsed', t => {
  const context = ctx();
  const wrapper = mk_stubbed(field_def, data_item, context, [
    <div className="sbw-child sbw-child-1" key="k1"></div>,
    <div className="sbw-child sbw-child-2" key="k2"></div>,
  ]);
  wrapper.dive().find('.subblock-wrapper-toggle').prop('onClick')({
    currentTarget: {
      blur: sinon.spy(),
    },
  });

  wrapper.update();
  t.is(2, wrapper.dive().find('.sbw-child').length);
  t.is(1, wrapper.dive().find('.sbw-child-1').length);
  t.is(1, wrapper.dive().find('.sbw-child-2').length);
});


test('SubBlockWrapper: collapse toggle calls ctx should_redraw, block_toggled', t => {
  const context = ctx();
  const wrapper = mk_stubbed(field_def, data_item, context, [
    <div className="sbw-child sbw-child-1" key="k1"></div>,
    <div className="sbw-child sbw-child-2" key="k2"></div>,
  ]);
  wrapper.dive().find('.subblock-wrapper-toggle').prop('onClick')({
    currentTarget: {
      blur: sinon.spy(),
    },
  });

  t.true(context.should_redraw.calledOnce);
  t.true(context.block_toggled.calledOnce);
});


test('SubBlockWrapper: when optional, renders Toggle', t => {
  const wrapper = mk_stubbed(field_def__optional, data_item, {}, []);
  t.is(1, wrapper.dive().find('Toggle').length);
});


test('SubBlockWrapper: when optional, enable state respects initial presence/absence of data', t => {
  const wrapper__data    = mk_stubbed(field_def__optional, data_item, {}, [ ]);
  const wrapper__no_data = mk_stubbed(field_def__optional, data_item__no_subblock_data, {}, [ ]);

  t.true(wrapper__data.dive().find('Toggle').prop('checked'));
  t.false(wrapper__no_data.dive().find('Toggle').prop('checked'));
});


test('SubBlockWrapper: when optional, collapse toggle does nothing until enabled', t => {
  const context = ctx();
  const wrapper = mk_stubbed(field_def__optional, data_item__no_subblock_data, context, [
    <div className="sbw-child sbw-child-1" key="k1"></div>,
    <div className="sbw-child sbw-child-2" key="k2"></div>,
  ]);
  const toggle_collapse = () => {
    wrapper.dive().find('.subblock-wrapper-toggle').prop('onClick')({
      currentTarget: {
        blur: sinon.spy(),
      },
    });
    wrapper.update();
  };

  // Initially disabled: collapse toggle doesn't work
  toggle_collapse();
  t.is(0, wrapper.dive().find('.sbw-child').length);

  // After enable: collapse toggle works
  wrapper.dive().find('Toggle').prop('onChange')({
    currentTarget: {
      blur: sinon.spy(),
      checked: true,
    },
  });
  wrapper.update();
  toggle_collapse();
  t.is(2, wrapper.dive().find('.sbw-child').length);
});


test('SubBlockWrapper: toggle_enabled calls ctx value_updated, should_redraw, block_toggled', t => {
  const context = ctx();
  const wrapper = mk_stubbed(field_def__optional, data_item__no_subblock_data, context, [ ]);
  wrapper.dive().find('Toggle').prop('onChange')({
    currentTarget: {
      blur: sinon.spy(),
      checked: true,
    },
  });
  wrapper.update();
  t.true(context.value_updated.calledOnce);
  t.true(context.should_redraw.calledOnce);
  t.true(context.block_toggled.calledOnce);
});

