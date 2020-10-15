import Otter from '..';

const blocks = [
  { type: 'B1', },
  {
    type: 'B2',
    fields: [
      {
        name: 'size',
        type: Otter.Fields.Radios,
        options: {
          regular: 'Regular',
          large:   'Large',
        },
      },
      {
        name: 'text',
        type: Otter.Fields.TextInput,
      },
    ],
  },
  {
    type: 'B3',
    fields: [
      {
        name: 'content_item',
        type: Otter.Fields.NestedBlock,
        nested_block_type: 'AContentItem',
      },
    ],
  },
  {
    type: 'B4',
    fields: [
      {
        name: 'content_items',
        type: Otter.Fields.Repeater,
        nested_block_types: [
          'AnotherContentItem',
          'OneMoreContentItem',
        ],
      },
    ],
  },
  { type: 'AContentItem',       fields: [{ name: 'f', type: Otter.Fields.TextInput }] },
  { type: 'AnotherContentItem', fields: [{ name: 'f', type: Otter.Fields.TextInput }] },
  { type: 'OneMoreContentItem', fields: [{ name: 'f', type: Otter.Fields.TextInput }] },
];


const blocks_with_invalid_field_type = [
  {
    type: 'BlockWithInvalidFieldType',
    fields: [
      {
        name: 'InvalidField',
        type: 'Muffins',
      },
    ],
  },
];

function get_blocks() {
  return Otter.Utils.copy(blocks);
}

function get_blocks_with_invalid_field_type() {
  return Otter.Utils.copy(blocks_with_invalid_field_type);
}

get_blocks.with_invalid_field_type = get_blocks_with_invalid_field_type;


export default get_blocks;

