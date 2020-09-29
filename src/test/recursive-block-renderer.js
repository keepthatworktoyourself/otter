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


test('RFR: field required properties are checked', t => {
  const data = [
    { __type: 'BlockWithFieldWithMissingNameAndType' },
  ];
  const blocks = [
    {
      type: 'BlockWithFieldWithMissingNameAndType',
      fields: [{
        description: 'This field should output an error for name and type',
      }],
    },
  ];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data[0]} block={blocks[0]} />);
  const error_field = wrapper.find('ErrorField');
  const error_wrapper = error_field.dive();
  t.truthy(error_wrapper.text().match(/missing required properties:\s+type, name/));
});


test('RFR: has field with display_if error -> ErrorField', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  const data_item = test_data(true)[1];
  block.fields[0].display_if = 'invalid type';

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} />);
  t.truthy(wrapper.find('ErrorField').dive().text().match('must be an array of rules or single rule object'));
});


test('RFR: has field with display_if false -> null', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  const data_item = test_data(true)[1];

  block.fields[1].display_if = {
    sibling:  'size',
    equal_to: 'something',
  };

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} />);
  t.is(null, wrapper.get(1));
});


test('RFR: has field with display_if true or not set -> field component, props passed', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  const data_item = test_data(true)[1];

  block.fields[1].display_if = {
    sibling:  'size',
    equal_to: 'regular',
  };

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} is_top_level={true} />);
  const field_without_display_if = wrapper.find(block.fields[0].type);
  const field_with_display_if    = wrapper.find(block.fields[1].type);
  t.is(1, field_without_display_if.length);
  t.is(1, field_with_display_if.length);
  t.is(block.fields[1], field_with_display_if.get(0).props.field_def);
  t.is(data_item,       field_with_display_if.get(0).props.containing_data_item);
  t.is(true,            field_with_display_if.get(0).props.is_top_level);
});


test('RFR: subblock field -> SubBlock component, props passed', t => {
  const block = Otter.Utils.copy(test_blocks)[2];
  const data_item = test_data(true)[2];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} />);
  const subblock = wrapper.find('SubBlock');
  t.is(1, subblock.length);
  t.is(block,           subblock.get(0).props.containing_block);
  t.is(block.fields[0], subblock.get(0).props.field_def);
  t.is(data_item,       subblock.get(0).props.containing_data_item);
});


test('RFR: subblock array field -> Repeater component, props passed', t => {
  const block = Otter.Utils.copy(test_blocks)[3];
  const data_item = test_data(true)[3];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} />);
  const repeater = wrapper.find('Repeater');
  t.is(1, repeater.length);
  t.is(block,           repeater.get(0).props.containing_block);
  t.is(block.fields[0], repeater.get(0).props.field_def);
  t.is(data_item,       repeater.get(0).props.containing_data_item);
});


test('RFR: has field with invalid field name -> ErrorField', t => {
  const block = Otter.Utils.copy(test_blocks.with_invalid_field_type)[0];
  const data_item = test_data.with_invalid_field_type(true)[0];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} block={block} />);
  const error_field = wrapper.find('ErrorField');
  t.is(1, error_field.length);

  const error_wrapper = error_field.dive();
  t.truthy(error_wrapper.text().match(/has an invalid field type/));
});

