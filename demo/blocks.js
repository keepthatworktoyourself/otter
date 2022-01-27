import PencilSolid from 'simple-react-heroicons/icons/PencilSolid'
import CogSolid from 'simple-react-heroicons/icons/CogSolid'
import MenuAlt2Solid from 'simple-react-heroicons/icons/MenuAlt2Solid'
import MenuSolid from 'simple-react-heroicons/icons/MenuSolid'
import MenuAlt3Solid from 'simple-react-heroicons/icons/MenuAlt3Solid'
import Otter from '../src/index'
import Fields from '../src/core/definitions/fields'
import {dynamic_data, set_dynamic_data} from '../src/core/definitions/utils'

set_dynamic_data('block_colors', {
  'bg-white':    'white',
  'bg-zinc-50':  'zinc-50',
  'bg-zinc-100': 'zinc-100',
  'bg-zinc-200': 'zinc-200',
  'bg-zinc-300': 'zinc-300',
  'bg-zinc-400': 'zinc-400',
  'bg-zinc-500': 'zinc-500',
  'bg-zinc-600': 'zinc-600',
  'bg-zinc-700': 'zinc-700',
  'bg-zinc-800': 'zinc-800',
  'bg-zinc-900': 'zinc-900',
})
set_dynamic_data('default_block_color', 'bg-zinc-50')

export const block_options = {
  type:   'BlockOptions',
  fields: [
    {
      name:    'top_padding',
      type:    Fields.Radios,
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
      type:    Fields.Radios,
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
      type:          Fields.Bool,
      align:         'horizontal',
      width:         'half',
      default_value: false,
    },
    {
      name:          'bottom_border',
      type:          Fields.Bool,
      align:         'horizontal',
      width:         'half',
      default_value: false,
    },
    {
      name:    'theme',
      type:    Otter.Fields.Radios,
      align:   'horizontal',
      width:   'half',
      options: {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          Fields.Radios,
      swatches:      true,
      options:       dynamic_data('block_colors'),
      default_value: dynamic_data('default_block_color'),
    },
  ],
}

const header_block_fields = [
  {
    name: 'heading',
    type: Otter.Fields.TextInput,
  },
  {
    name:        'subheading',
    description: 'Catchy subheading',
    type:        Otter.Fields.TextInput,
  },
  {
    name:          'align',
    type:          Otter.Fields.Radios,
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
    type:          Otter.Fields.Radios,
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
  className:   'block',
  fields:      [
    {
      name:           'content',
      description:    'Text content',
      with_label:     false,
      type:           Otter.Fields.TextEditor,
      heading_levels: [1, 2, 3, 4, 5, 6],
      hr:             true,
      blockquote:     true,
      className:      'pt-2',
    },
    {
      name:           'align',
      type:           Otter.Fields.Radios,
      align:          'horizontal',
      classNameLabel: 'opacity-40',
      width:          'half',
      options:        {
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
      name:          'fancy',
      description:   'Fancy lettering',
      type:          Otter.Fields.Bool,
      align:         'horizontal',
      width:         'half',
      default_value: true,
    },
    {
      name:          'dropcap_color',
      type:          Otter.Fields.Radios,
      swatches:      true,
      default_value: '#4fc3f7',
      align:         'horizontal',
      width:         'half',
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
  ],
}

export const html_block = {
  type:        'HTML',
  description: 'Raw HTML',
  fields:      [
    {
      name:        'html',
      description: 'HTML',
      type:        Otter.Fields.TextArea,
      mono:        true,
    },
  ],
}

export const block_with_nested_block = {
  type:        'NestedBlockDemo',
  description: 'Nested Blocks',
  fields:      [
    {
      name:              'searchable',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: 'SearchablesDemo',  // Supports name of block defined elsewhere
      optional:          true,
    },
    {
      name:              'text_content',
      type:              Otter.Fields.NestedBlock,
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
      type:               Otter.Fields.Repeater,
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
      type:               Otter.Fields.Repeater,
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
      with_label:  false,
      type:        Otter.Fields.Searchable,
      search:      () => [
        {value: 'x', display: 'A search result'},
      ],
    },
  ],
}
