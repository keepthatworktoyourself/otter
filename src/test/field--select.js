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
      name: 'select_field',
      description: 'Select something',
      type: Otter.Fields.Select,
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
  select_field: 'b',
};
const data_item__not_set = {
  __type: 'X',
};


function mk_stubbed(field_def, containing_data_item, ctx_methods, is_top_level) {
  return mount(<Otter.Fields.components.Select field_def={field_def}
                                               containing_data_item={containing_data_item}
                                               consumer_component={stubs.func_stub([{...ctx_methods}])}
                                               is_top_level={is_top_level} />);
}


test('Select: no opts -> warning msg', t => {
  const b = Otter.Utils.copy(block);
  delete b.fields[0].options;
  const wrapper = mk_stubbed(b.fields[0], data_item, {}, true);
  const opts_wrapper = wrapper.find('.select');

  t.is(1, opts_wrapper.length);
  t.is('[Select field has no options!]', opts_wrapper.text());
});


test('Select: renders options, initial item or null item selected', t => {
  const wrapper          = mk_stubbed(block.fields[0], data_item,          {}, true);
  const wrapper__not_set = mk_stubbed(block.fields[0], data_item__not_set, {}, true);

  const select          = wrapper.find('select');
  const select__not_set = wrapper__not_set.find('select');

  const opts          = wrapper.find('select > option');
  const opts__not_set = wrapper__not_set.find('select > option');
  const n_opts        = Object.keys(block.fields[0].options).length;

  t.is(1, select.length);
  t.is(1, select__not_set.length);

  t.is(n_opts + 1, opts.length);
  t.is(n_opts + 1, opts__not_set.length);

  t.deepEqual(['Select an option', 'A', 'B', 'C'], opts.map(item => item.text()));
  t.is('b', select.get(0).props.value);
  t.is('', select__not_set.get(0).props.value);
});


test('Select: option change updates state, calls ctx update methods', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true; },
    should_redraw() { ctx.should_redraw.called = true; },
  };
  const d = Otter.Utils.copy(data_item);

  const wrapper = mk_stubbed(block.fields[0], d, ctx);
  const select = wrapper.find('select');

  select.simulate('change', {target: {value: 'c'}});
  t.is(true, ctx.value_updated.called);
  t.is(true, ctx.should_redraw.called);
  t.is('c', d.select_field);
});


test('Select: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk_stubbed(block.fields[0], data_item, {}, true);
  const wrapper__nested = mk_stubbed(block.fields[0], data_item, {}, false);

  const lbl__top    = wrapper__top.find('FieldLabel');
  const lbl__nested = wrapper__nested.find('FieldLabel');

  t.is(1, lbl__top.length);
  t.is(1, lbl__nested.length)
  t.is('Select something', lbl__top.get(0).props.label);
  t.is(true,  lbl__top.get(0).props.is_top_level);
  t.is(false, lbl__nested.get(0).props.is_top_level);
});

