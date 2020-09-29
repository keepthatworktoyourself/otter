import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import stubs from './_stubs';
import Otter from '..';


configure({ adapter: new Adapter() });


const block = {
  type: 'X',
  fields: [
    {
      name: 'bool_field',
      description: 'Turn on the thing',
      type: Otter.Fields.Bool,
    },
  ],
};
const data_item__false = {
  __type: 'X',
  bool_field: false,
};
const data_item__true = {
  __type: 'X',
  bool_field: true,
};


function mk_stubbed(field_def, containing_data_item, ctx_methods, is_top_level) {
  return mount(<Otter.Fields.components.Bool field_def={field_def}
                                             containing_data_item={containing_data_item}
                                             consumer_component={stubs.func_stub([{...ctx_methods}])}
                                             is_top_level={is_top_level} />);
}


test('Bool: renders input with toggles, initial value', t => {
  const wrapper__false = mk_stubbed(block.fields[0], data_item__false);
  const wrapper__true  = mk_stubbed(block.fields[0], data_item__true);

  const btn__yes = wrapper__false.find('a[data-value="yes"]');
  const btn__no  = wrapper__false.find('a[data-value="no"]');

  const input__false = wrapper__false.find('input');
  const input__true  = wrapper__true.find('input');

  t.is(1, btn__yes.length);
  t.is(1, btn__no.length);

  t.is(1, input__false.length);
  t.is(1, input__true.length);

  t.is(false, input__false.get(0).props.checked);
  t.is(true,  input__true.get(0).props.checked);
});


test('Bool: renders text__yes and text__no', t => {
  const b = Otter.Utils.copy(block);
  b.fields[0].text__yes = 'Certainly';
  b.fields[0].text__no  = 'Absolutely not';

  const wrapper__false = mk_stubbed(b.fields[0], data_item__false);
  const btn__yes = wrapper__false.find('a[data-value="yes"]');
  const btn__no  = wrapper__false.find('a[data-value="no"]');

  t.truthy(btn__yes.text().match(/Certainly/));
  t.truthy(btn__no.text().match(/Absolutely not/));
});


test('Bool: click updates state and calls ctx updated methods', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true; },
    should_redraw() { ctx.should_redraw.called = true; },
  };

  const wrapper = mk_stubbed(block.fields[0], data_item__false, ctx);
  const btn__yes = wrapper.find('a[data-value="yes"]');
  t.is(false, wrapper.find('input').get(0).props.checked);

  btn__yes.simulate('click');
  t.is(true, ctx.value_updated.called);
  t.is(true, ctx.should_redraw.called);
  t.is(true, wrapper.find('input').get(0).props.checked);
});


test('Bool: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk_stubbed(block.fields[0], data_item__false, {}, true);
  const wrapper__nested = mk_stubbed(block.fields[0], data_item__false, {}, false);

  const lbl__top    = wrapper__top.find('FieldLabel');
  const lbl__nested = wrapper__nested.find('FieldLabel');

  t.is(1, lbl__top.length);
  t.is(1, lbl__nested.length)
  t.is('Turn on the thing', lbl__top.get(0).props.label);
  t.is(true,  lbl__top.get(0).props.is_top_level);
  t.is(false, lbl__nested.get(0).props.is_top_level);
});

