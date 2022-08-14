import * as Utils from '../core/definitions/utils'
import FieldTypes from '../core/definitions/field-types'

const blocks = [
  {type: 'B1'},
  {
    type:   'B2',
    fields: [
      {
        name:    'size',
        type:    FieldTypes.Radios,
        options: {
          regular: 'Regular',
          large:   'Large',
        },
      },
      {
        name: 'text',
        type: FieldTypes.TextInput,
      },
    ],
  },
  {
    type:   'B3',
    fields: [
      {
        name:         'content_item',
        type:         FieldTypes.NestedBlock,
        nested_block: 'AContentItem',
      },
    ],
  },
  {
    type:   'B4',
    fields: [
      {
        name:          'content_items',
        type:          FieldTypes.Repeater,
        nested_blocks: [
          'AnotherContentItem',
          'OneMoreContentItem',
        ],
      },
    ],
  },
  {type: 'AContentItem',       fields: [{name: 'f', type: FieldTypes.TextInput}]},
  {type: 'AnotherContentItem', fields: [{name: 'f', type: FieldTypes.TextInput}]},
  {type: 'OneMoreContentItem', fields: [{name: 'f', type: FieldTypes.TextInput}]},
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

