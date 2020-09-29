import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RecursiveBlockRenderer from '../core/RecursiveBlockRenderer';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';


configure({ adapter: new Adapter() });


const block = {
  type: 'X',
  fields: [
    {
      name: 'radios_field',
      description: 'Pick something',
      type: Otter.Fields.Radios,
      options: {
        a: 'A',
        b: 'B',
        c: 'C',
      },
    },
  ],
};
const data_item = {
  __type: 'X',
  radios_field: 'b',
};
const data_item__not_set = {
  __type: 'X',
};


function mk_stubbed(field_def, containing_data_item, ctx_methods, is_top_level) {
  return mount(<Otter.Fields.components.Radios field_def={field_def}
                                               containing_data_item={containing_data_item}
                                               consumer_component={stubs.func_stub([{...ctx_methods}])}
                                               is_top_level={is_top_level} />);
}


test('Radios: no opts -> warning msg', t => {
  const b = Otter.Utils.copy(block);
  delete b.fields[0].options;
  const wrapper = mk_stubbed(b.fields[0], data_item, {}, true);
  const opts_wrapper = wrapper.find('.buttons');

  t.is(1, opts_wrapper.length);
  t.is('[Radio field has no options!]', opts_wrapper.text());
});


test('Radios: renders radio options, initial value selected', t => {
  const wrapper = mk_stubbed(block.fields[0], data_item, {}, true);
  const opts    = wrapper.find('a.radio-option');
  const n_opts  = Object.keys(block.fields[0].options).length;

  t.is(n_opts, opts.length);
  t.deepEqual(['A', 'B', 'C'], opts.map(item => item.text()));

  const selected_opt = opts.find('[checked=true]');
  t.is(1, selected_opt.length);
  t.is('b', selected_opt.get(0).props.value);
});


test('Radios: click updates state, calls ctx update methods', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true; },
    should_redraw() { ctx.should_redraw.called = true; },
  };

  const wrapper = mk_stubbed(block.fields[0], data_item, ctx);
  const opt__c = wrapper.find('.radio-option[data-value="c"]');
  t.is(1, opt__c.length);

  opt__c.simulate('click');

  const selected_opt = wrapper.find('input[checked=true]');
  t.is(true, ctx.value_updated.called);
  t.is(true, ctx.should_redraw.called);
  t.is(1, selected_opt.length);
  t.is('c', selected_opt.get(0).props.value);
});


test('Radios: clear button sets value to null', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true; },
    should_redraw() { ctx.should_redraw.called = true; },
  };

  const wrapper = mk_stubbed(block.fields[0], data_item, ctx);
  const clear_btn = wrapper.find('.radio-clear-btn');
  t.is(1, clear_btn.length);

  clear_btn.simulate('click');

  const selected_opt = wrapper.find('input[checked=true]');
  t.is(true, ctx.value_updated.called);
  t.is(true, ctx.should_redraw.called);
  t.is(0, selected_opt.length);
});


test('Radios: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk_stubbed(block.fields[0], data_item, {}, true);
  const wrapper__nested = mk_stubbed(block.fields[0], data_item, {}, false);

  const lbl__top    = wrapper__top.find('FieldLabel');
  const lbl__nested = wrapper__nested.find('FieldLabel');

  t.is(1, lbl__top.length);
  t.is(1, lbl__nested.length)
  t.is('Pick something', lbl__top.get(0).props.label);
  t.is(true,  lbl__top.get(0).props.is_top_level);
  t.is(false, lbl__nested.get(0).props.is_top_level);
});

