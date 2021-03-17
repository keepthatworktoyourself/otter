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


test('RBR: field definition errors -> ErrorFields', t => {
  const data = [
    { __type: 'BlockWithFieldWithMissingNameAndType' },
  ];
  const blocks = [
    {
      type: 'BlockWithFieldWithMissingNameAndType',
      fields: [
        {
          description: 'missing name and type',
        },
        undefined,
        null,
        'oops',
      ],
    },
  ];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data[0]} blocks={blocks} />);
  const error_fields = wrapper.find('ErrorField');
  const err0 = error_fields.at(0).dive();
  const err1 = error_fields.at(1).dive();
  const err2 = error_fields.at(2).dive();
  const err3 = error_fields.at(3).dive();

  t.is(4, error_fields.length);
  t.truthy(err0.text().match(/field at index 0 is missing required properties:\s+type, name/));
  t.truthy(err1.text().match(/field at index 1 is undefined instead of object/));
  t.truthy(err2.text().match(/field at index 2 is null instead of object/));
  t.truthy(err3.text().match(/field at index 3 is string instead of object/));
});


test('RBR: field with display_if error: renders ErrorField', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  const data_item = test_data()[1];
  block.fields[0].display_if = 'invalid type';

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={[block]} />);
  t.truthy(wrapper.find('ErrorField').dive().text().match('display_if must be an object or array of objects'));
});


test('RBR: field with display_if false: renders null', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  const data_item = test_data()[1];

  block.fields[1].display_if = {
    sibling:  'size',
    equal_to: 'something',
  };

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={[block]} />);
  t.is(null, wrapper.get(1));
});


test('RBR: field with display_if true or not set: renders field, props passed', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  const data_item = test_data()[1];

  block.fields[1].display_if = {
    sibling:  'size',
    equal_to: 'regular',
  };

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={[block]} is_top_level={true} />);
  const field_without_display_if = wrapper.find(block.fields[0].type);
  const field_with_display_if    = wrapper.find(block.fields[1].type);
  t.is(1, field_without_display_if.length);
  t.is(1, field_with_display_if.length);
  t.is(block.fields[1], field_with_display_if.get(0).props.field_def);
  t.is(data_item,       field_with_display_if.get(0).props.containing_data_item);
  t.is(true,            field_with_display_if.get(0).props.is_top_level);
});


test('RBR: nested_block field: renders NestedBlockWrapper with RecursiveBlockRenderer', t => {
  const block     = test_blocks()[2];
  const data_item = test_data()[2];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={test_blocks()} />);
  const nested_block_wrapper = wrapper.find('NestedBlockWrapper');
  t.is(1, nested_block_wrapper.length);
  t.is(block.fields[0].optional, nested_block_wrapper.prop('is_optional'));
  t.deepEqual(block.fields[0],   nested_block_wrapper.prop('field_def'));
  t.deepEqual(data_item,         nested_block_wrapper.prop('containing_data_item'));

  const inner_renderer = nested_block_wrapper.find('RecursiveBlockRenderer');
  t.is(1, inner_renderer.length);
  t.deepEqual(data_item,     inner_renderer.prop('containing_data_item'));
  t.is('content_item',       inner_renderer.prop('field_name'));
  t.deepEqual(test_blocks(), inner_renderer.prop('blocks'));
});


test('RBR: nested_block_field: nested_block_type supports full inline definition object as well as string', t => {
  const nested_block = {
    type: 'MyNestedBlock',
    fields: [
      {
        name: 'title',
        type: Otter.Fields.TextInput,
      },
    ],
  };
  const blocks = [{
    type: 'MyBlock',
    fields: [
      {
        name: 'a_nested_block',
        type: Otter.Fields.NestedBlock,
        nested_block_type: nested_block,
      },
    ],
  }];
  const data_item = {
    __type: 'MyBlock',
    a_nested_block: {
      __type: 'MyNestedBlock',
      title: 'A nested block',
    },
  };

  const wrapper__block = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={blocks} />);
  const wrapper__nested_block_field = shallow(<RecursiveBlockRenderer containing_data_item={data_item} field_name="a_nested_block" blocks={blocks} />);
  t.is(1, wrapper__block.find('NestedBlockWrapper').length);
  const text_input = wrapper__nested_block_field.find('TextInput');
  t.is(1, text_input.length);
  t.deepEqual({
    field_def:            nested_block.fields[0],
    containing_data_item: data_item.a_nested_block,
    is_top_level:         undefined,
    is_display_if_target: false,
  }, text_input.props());
});


test('RBR: repeater field: renders NestedBlockWrapper with Repeater component', t => {
  const block     = test_blocks()[3];
  const data_item = test_data()[3];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={test_blocks()} />);
  const nested_block_wrapper = wrapper.find('NestedBlockWrapper');
  const repeater = nested_block_wrapper.find('Repeater');
  t.is(1, nested_block_wrapper.length);
  t.is(1, repeater.length);
  t.deepEqual(block.fields[0], repeater.prop('field_def'));
  t.deepEqual(data_item,       repeater.prop('containing_data_item'));
});


test('RBR: has field with invalid field name -> ErrorField', t => {
  const block = Otter.Utils.copy(test_blocks.with_invalid_field_type())[0];
  const data_item = test_data.with_invalid_field_type()[0];

  const wrapper = shallow(<RecursiveBlockRenderer data_item={data_item} blocks={[block]} />);
  const error_field = wrapper.find('ErrorField');
  t.is(1, error_field.length);

  const error_wrapper = error_field.dive();
  t.truthy(error_wrapper.text().match(/has an invalid field type/));
});


test('RBR: ensures nested blocks and repeaters have data to operate on', t => {
  const item__nested_block_missing = { __type: 'B3' };
  const item__nested_block_null = { __type: 'B3', content_item: null };

  const wrapper__nested_block_missing = mount(<RecursiveBlockRenderer data_item={item__nested_block_missing} blocks={test_blocks()} />);
  const wrapper__nested_block_null    = mount(<RecursiveBlockRenderer data_item={item__nested_block_null}    blocks={test_blocks()} />);
  const exp = {
    __type: 'B3',
    content_item: {
      __type: 'AContentItem',
    },
  };
  t.deepEqual(exp, item__nested_block_missing);
  t.deepEqual(exp, item__nested_block_null);
});

