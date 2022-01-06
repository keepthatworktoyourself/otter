import * as Utils from '../core/definitions/utils'
import Fields from '../core/definitions/fields'

const blocks = [
  {type: 'B1'},
  {
    type:   'B2',
    fields: [
      {
        name:    'size',
        type:    Fields.Radios,
        options: {
          regular: 'Regular',
          large:   'Large',
        },
      },
      {
        name: 'text',
        type: Fields.TextInput,
      },
    ],
  },
  {
    type:   'B3',
    fields: [
      {
        name:              'content_item',
        type:              Fields.NestedBlock,
        nested_block_type: 'AContentItem',
      },
    ],
  },
  {
    type:   'B4',
    fields: [
      {
        name:               'content_items',
        type:               Fields.Repeater,
        nested_block_types: [
          'AnotherContentItem',
          'OneMoreContentItem',
        ],
      },
    ],
  },
  {type: 'AContentItem',       fields: [{name: 'f', type: Fields.TextInput}]},
  {type: 'AnotherContentItem', fields: [{name: 'f', type: Fields.TextInput}]},
  {type: 'OneMoreContentItem', fields: [{name: 'f', type: Fields.TextInput}]},
]


const blocks_with_invalid_field_type = [
  {
    type:   'BlockWithInvalidFieldType',
    fields: [
      {
        name: 'InvalidField',
        type: 'Muffins',
      },
    ],
  },
]

function get_blocks() {
  return Utils.copy(blocks)
}

function get_blocks_with_invalid_field_type() {
  return Utils.copy(blocks_with_invalid_field_type)
}

get_blocks.with_invalid_field_type = get_blocks_with_invalid_field_type


export default get_blocks

