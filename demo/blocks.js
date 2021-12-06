import Otter from '../src/index'
import field_types from '../src/core/field-interfaces/field-interfaces'
import PencilSolid from 'simple-react-heroicons/icons/PencilSolid'
import CogSolid from 'simple-react-heroicons/icons/CogSolid'
import MenuAlt2Solid from 'simple-react-heroicons/icons/MenuAlt2Solid'
import MenuSolid from 'simple-react-heroicons/icons/MenuSolid'
import MenuAlt3Solid from 'simple-react-heroicons/icons/MenuAlt3Solid'
import {dynamic_data, set_dynamic_data} from '../src/core/definitions/utils'

set_dynamic_data('block_colors', {
  'bg-white':    'white',
  'bg-gray-50':  'gray-50',
  'bg-gray-100': 'gray-100',
  'bg-gray-200': 'gray-200',
  'bg-gray-300': 'gray-300',
  'bg-gray-400': 'gray-400',
  'bg-gray-500': 'gray-500',
  'bg-gray-600': 'gray-600',
  'bg-gray-700': 'gray-700',
  'bg-gray-800': 'gray-800',
  'bg-gray-900': 'gray-900',
})
set_dynamic_data('default_block_color', 'bg-gray-50')

export const block_options = {
  type:   'BlockOptions',
  fields: [
    {
      name:    'top_padding',
      type:    field_types.Radios,
      align:   'horizontal',
      width:   'half',
      options: {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:    'bottom_padding',
      type:    field_types.Radios,
      align:   'horizontal',
      width:   'half',
      options: {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:          'top_border',
      type:          field_types.Bool,
      align:         'horizontal',
      width:         'half',
      default_value: false,
    },
    {
      name:          'bottom_border',
      type:          field_types.Bool,
      align:         'horizontal',
      width:         'half',
      default_value: false,
    },
    {
      name:                'theme',
      with_label:          false,
      someKindaCustomData: {
        foo: 'foo',
        bar: 'bar',
      },
      type:    Otter.FieldTypes.Radios,
      options: {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          field_types.Radios,
      swatches:      true,
      options:       dynamic_data('block_colors'),
      default_value: dynamic_data('default_block_color'),
    },
  ],
}

const header_block_fields = [
  {
    name: 'heading',
    type: Otter.FieldTypes.TextInput,
  },
  {
    name:        'subheading',
    description: 'Catchy subheading',
    type:        Otter.FieldTypes.TextInput,
  },
  {
    name:          'align',
    type:          Otter.FieldTypes.Radios,
    align:         'horizontal',
    description:   'Text alignment',
    default_value: 'right',
    options:       {
      left:   'Left',
      center: 'Center',
      right:  'Right',
    },
    icons: {
      left:   MenuAlt2Solid,
      center: MenuSolid,
      right:  MenuAlt3Solid,
    },
  },
  {
    name:          'display',
    type:          Otter.FieldTypes.Radios,
    align:         'horizontal',
    description:   'Display',
    default_value: 'block',
    options:       {
      none:  'None',
      block: 'Block',
      flex:  'Flex',
    },
  },
]

const header_block_field_names = header_block_fields.map(field => field.name)
const block_options_field_names = block_options.fields.map(field => field.name)

export const header_block = {
  type:      'Header',
  thumbnail: 'https://res.cloudinary.com/drtjqpz13/image/upload/v1638776102/Wombat/Screenshot_2021-12-06_at_07.34.30.png',
  fields:    [...header_block_fields, ...block_options.fields],
  tabs:      [
    {
      Icon:   PencilSolid,
      fields: header_block_field_names,
    },
    {
      Icon:   CogSolid,
      fields: block_options_field_names,
    },
  ],
}

export const text_block = {
  type:        'Text',
  description: 'Text content',
  fields:      [
    {
      name:           'content',
      description:    'Text content',
      type:           Otter.FieldTypes.TextEditor,
      heading_levels: [1, 2, 3, 4, 5, 6],
      hr:             true,
      blockquote:     true,
    },
    {
      name:          'fancy',
      description:   'Fancy lettering',
      type:          Otter.FieldTypes.Bool,
      default_value: true,
    },
    {
      name:          'dropcap_color',
      type:          Otter.FieldTypes.Radios,
      swatches:      true,
      default_value: '#4fc3f7',
      options:       {
        '#f06292': 'pink',
        '#9575cd': 'purple',
        '#4fc3f7': 'light blue',
        '#4dd0e1': 'cyan',
        '#ffd54f': 'amber',
        '#fff176': 'yellow',
      },
      display_if: {
        sibling:  'fancy',
        equal_to: true,
      },
    },
    {
      name:    'align',
      type:    Otter.FieldTypes.Select,
      options: {
        left:   'Left',
        right:  'Right',
        center: 'Center',
      },
    },
  ],
}

export const html_block = {
  type:        'HTML',
  description: 'Raw HTML',
  fields:      [
    {
      name:        'html',
      description: 'HTML',
      type:        Otter.FieldTypes.TextArea,
      mono:        true,
    },
  ],
}

export const block_with_nested_block = {
  type:        'NestedBlockDemo',
  description: 'Nested Blocks',
  fields:      [
    {
      name:              'searchables',
      type:              Otter.FieldTypes.NestedBlock,
      nested_block_type: 'SearchablesDemo',  // Supports name of block defined elsewhere
      optional:          true,
    },
    {
      name:              'text_content',
      type:              Otter.FieldTypes.NestedBlock,
      nested_block_type: text_block,  // Supports inline block object
    },
  ],
}

export const block_with_repeater_one_type = {
  type:        'RepeaterDemoOneType',
  description: 'Repeater Fields (Just One Type)',
  fields:      [
    {
      name:               'content_items',
      description:        'Content:',
      type:               Otter.FieldTypes.Repeater,
      block_titles:       true,
      nested_block_types: [
        html_block,       // Supports name of block defined elsewhere
      ],
    },
  ],
}

export const block_with_repeater = {
  type:        'RepeaterDemo',
  description: 'Repeater Fields',
  fields:      [
    {
      name:               'content_items',
      description:        'Content:',
      type:               Otter.FieldTypes.Repeater,
      block_titles:       true,
      nested_block_types: [
        'Text',       // Supports name of block defined elsewhere
        html_block,   // Supports inline block object
      ],
    },
  ],
}

export const searchables = {
  type:        'SearchablesDemo',
  description: 'Searchables Demo',
  fields:      [
    {
      name:        'my_searchable',
      description: 'Search Content Field',
      type:        Otter.FieldTypes.Searchable,
      search:      () => [
        {value: 'x', display: 'A search result'},
      ],
    },
  ],
}
