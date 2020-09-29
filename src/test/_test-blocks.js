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
        type: Otter.Fields.SubBlock,
        subblock_type: 'AContentItem',
      },
    ],
  },
  {
    type: 'B4',
    fields: [
      {
        name: 'content_items',
        type: Otter.Fields.SubBlockArray,
        subblock_types: [
          'AnotherContentItem',
          'OneMoreContentItem',
        ],
      },
    ],
  },
];


blocks.with_invalid_field_type = [
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


export default blocks;

