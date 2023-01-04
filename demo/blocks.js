import PencilSolid from 'simple-react-heroicons/icons/PencilSolid'
import CogSolid from 'simple-react-heroicons/icons/CogSolid'
import MenuAlt2Solid from 'simple-react-heroicons/icons/MenuAlt2Solid'
import MenuSolid from 'simple-react-heroicons/icons/MenuSolid'
import MenuAlt3Solid from 'simple-react-heroicons/icons/MenuAlt3Solid'
import Otter from '../src/index'
import FieldTypes from '../src/core/definitions/field-types'
import {dynamic_data, set_dynamic_data} from '../src/core/definitions/utils'

const horizontal_field_layout_classes = 'flex items-center justify-between'

set_dynamic_data('block_colors', [
  {
    label:  'Greys',
    colors: [
      {
        value:               'bg-white',
        output_class_or_hex: 'bg-white',
      },
      {
        value:               'bg-zinc-50',
        output_class_or_hex: 'bg-zinc-50',
      },
      {
        value:               'bg-zinc-100',
        output_class_or_hex: 'bg-zinc-100',
      },
      {
        value:               'bg-zinc-200',
        output_class_or_hex: 'bg-zinc-200',
      },
      {
        value:               'bg-zinc-300',
        output_class_or_hex: 'bg-zinc-300',
      },
      {
        value:               'bg-zinc-400',
        output_class_or_hex: 'bg-zinc-400',
      },
    ],
  },
])
set_dynamic_data('block_colors_multi_row', [
  {
    label:  'Greys Part 1',
    colors: [
      {
        value:               'bg-white',
        output_class_or_hex: 'bg-white',
      },
      {
        value:               'bg-zinc-50',
        output_class_or_hex: 'bg-zinc-50',
      },
      {
        value:               'bg-zinc-100',
        output_class_or_hex: 'bg-zinc-100',
      },
    ],
  },
  {
    label:  'Greys Part 2',
    colors: [
      {
        value:               'bg-zinc-200',
        output_class_or_hex: 'bg-zinc-200',
      },
      {
        value:               'bg-zinc-300',
        output_class_or_hex: 'bg-zinc-300',
      },
      {
        value:               'bg-zinc-400',
        output_class_or_hex: 'bg-zinc-400',
      },
    ],
  },
])
set_dynamic_data('default_block_color', 'bg-zinc-50')

const block_option_field_layout_classes = `pr-[30%] w-full ${horizontal_field_layout_classes}`

export const block_options = {
  type:   'BlockOptions',
  fields: [
    {
      name:          'top_padding',
      type:          FieldTypes.Radios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      options:       {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:          'bottom_padding',
      type:          FieldTypes.Radios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      options:       {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:          'top_border',
      type:          FieldTypes.Bool,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      default_value: false,
    },
    {
      name:          'bottom_border',
      type:          FieldTypes.Bool,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      default_value: false,
    },
    {
      name:          'theme',
      type:          Otter.FieldTypes.Radios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      options:       {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          FieldTypes.ColorSwatchRadios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      palette:       dynamic_data('block_colors'),
      default_value: dynamic_data('default_block_color'),
    },
  ],
}
const block_options_field_names = block_options.fields.map(
  field => field.name,
)

const btn_block = {
  type:        'Btn',
  description: 'Button',
  fields:      [
    {
      name: 'label',
      type: Otter.FieldTypes.TextInput,
    },
    {
      name: 'url',
      type: Otter.FieldTypes.TextInput,
    },
    {
      name:          'style',
      type:          Otter.FieldTypes.Radios,
      class_wrapper: `w-[calc(50%-0.5rem)] pt-1 mr-[1rem] flex items-center`,
      class_label:   'mr-[10px]',
      description:   'Style',
      default_value: 'secondary',
      options:       {
        secondary: 'Secondary',
        primary:   'Primary',
      },
    },
    {
      name:          'newTab',
      type:          Otter.FieldTypes.Select,
      mini:          true,
      class_wrapper: `w-[calc(50%-0.5rem)] pt-1 flex items-center`,
      class_label:   'mr-[10px]',
      class_field:   'flex-1 w-full',
      description:   'New tab',
      default_value: 'no',
      options:       {
        no:  'No',
        yes: 'Yes',
      },
    },
  ],
}

const btns_block = {
  type:   'Btns',
  fields: [
    {
      name:           'btns__btn',
      type:           Otter.FieldTypes.Repeater,
      add_item_label: 'Add a button',
      nested_blocks:  [
        btn_block,
      ],
    },
  ],
}

const header_block_fields = [
  {
    name: 'label',
    type: Otter.FieldTypes.TextInput,
  },
  {
    name: 'heading',
    type: Otter.FieldTypes.TextInput,
  },
  {
    name:           'text',
    description:    'Text',
    type:           Otter.FieldTypes.TextEditor,
    heading_levels: [1, 2, 3, 4, 5, 6],
    hr:             true,
    blockquote:     true,
  },
  {
    name:          'width',
    description:   'Width',
    type:          Otter.FieldTypes.NumberInput,
    default_value: 2,
    min:           1,
    max:           5,
    step:          1,
  },
  {
    name:        'media_item',
    description: 'Image',
    type:        Otter.FieldTypes.MediaPicker,
  },
  {
    name:                    'btns',
    description:             'Buttons (optional nested block)',
    type:                    Otter.FieldTypes.NestedBlock,
    nested_block:            btns_block, // Supports name of block defined elsewhere
    seamless:                false,
    __enabled_default_value: false,
    optional:                true,
    initially_open:          false,
  },
]

const header_block_field_names = header_block_fields.map(field => field.name)

export const header_block = {
  type:      'Header',
  thumbnail:
    'https://res.cloudinary.com/drtjqpz13/image/upload/v1638776102/Wombat/Screenshot_2021-12-06_at_07.34.30.png',
  fields: [...header_block_fields, ...block_options.fields],
  tabs:   [
    {
      Icon:   PencilSolid,
      label:  'Content',
      fields: header_block_field_names,
    },
    {
      Icon:   CogSolid,
      label:  'Settings',
      fields: block_options_field_names,
    },
  ],
}

export const text_block = {
  type:   'Text',
  fields: [
    {
      name:           'text_editor',
      description:    'Text',
      with_label:     false,
      type:           Otter.FieldTypes.TextEditor,
      heading_levels: [1, 2, 3, 4, 5, 6],
      hr:             true,
      blockquote:     true,
    },
    {
      name:          'align',
      type:          Otter.FieldTypes.Radios,
      class_wrapper: 'flex items-center space-x-4 pt-3 pb-1 mr-6',
      class_label:   'mb-0',
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
      name:          'display_if_example',
      description:   'Display if?',
      type:          Otter.FieldTypes.Bool,
      class_wrapper: 'flex items-center space-x-4 pt-3 pb-1',
      class_label:   'mb-0',
      default_value: false,
    },
    {
      name:          'display_if_example_target',
      description:   'If is true',
      type:          Otter.FieldTypes.Select,
      mini:          true,
      class_wrapper: 'pb-2 w-full',
      default_value: 'here_are',
      options:       {
        'here_are':  'Here are',
        'some_more': 'some more',
        'options':   'options',
      },
      display_if: {
        sibling:  'display_if_example',
        equal_to: true,
      },
    },
  ],
}

export const text_block_with_icon_tabs = {
  ...text_block,
  type:        'TextWithIconTabs',
  description: 'Text (with icon tabs)',
  tabs:        [
    {
      label:  'Tab 1', // label is overriden by Icon
      Icon:   PencilSolid,
      fields: ['text_editor'],
    },
    {
      label:  'Tab 2', // label is overriden by Icon
      Icon:   CogSolid,
      fields: ['display_if_example', 'display_if_example_target'],
    },
  ],
}

export const text_block_with_normal_tabs = {
  ...text_block,
  type:        'TextWithNormalTabs',
  description: 'Text (with normal tabs)',
  tabs:        [
    {
      label:  'Tab 1',
      fields: ['text_editor'],
    },
    {
      label:  'Tab 2',
      fields: ['display_if_example', 'display_if_example_target'],
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

const tabs_demo_block = {
  type:        'TabsDemoBlock',
  description: 'With Tabs',
  tabs:        [
    {
      label:  'General',
      fields: ['label', 'heading', 'text', 'some_select'],
    },
    {
      label:  'Advanced',
      fields: ['theme', 'color'],
    },
  ],
  fields: [
    {
      name: 'label',
      type: Otter.FieldTypes.TextInput,
    },
    {
      name: 'heading',
      type: Otter.FieldTypes.TextInput,
    },
    {
      name: 'text',
      type: Otter.FieldTypes.TextArea,
    },
    {
      name:        'some_select',
      description: 'Select',
      type:        Otter.FieldTypes.Select,
      options:     {
        one: 'Option 1',
        two: 'Option 2',
      },
      default_value: 'one',
    },
    {
      name:          'theme',
      type:          Otter.FieldTypes.Radios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      options:       {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          FieldTypes.ColorSwatchRadios,
      class_label:   'mb-0',
      class_wrapper: block_option_field_layout_classes,
      palette:       dynamic_data('block_colors_multi_row'),
      default_value: dynamic_data('default_block_color'),
    },
  ],
}

export const block_with_nested_block = {
  type:        'NestedBlockDemo',
  description: 'Nested Blocks',
  fields:      [
    {
      name:           'tabs_demo',
      description:    'Tabs',
      type:           Otter.FieldTypes.NestedBlock,
      nested_block:   tabs_demo_block, // Supports inline block object
      seamless:       true,
      initially_open: false,
    },
    {
      name:           'text_content',
      type:           Otter.FieldTypes.NestedBlock,
      nested_block:   text_block, // Supports inline block object
      seamless:       false,
      initially_open: false,
    },
    {
      name:                    'searchable',
      type:                    Otter.FieldTypes.NestedBlock,
      description:             'Searchable (Seamless Nested Block)',
      nested_block:            'SearchablesDemo', // Supports name of block defined elsewhere
      optional:                true,
      seamless:                true,
      __enabled_default_value: false,
    },
  ],
}

export const block_with_repeater_one_type = {
  type:        'RepeaterDemoOneType',
  description: 'Repeater Fields (Just One Type)',
  fields:      [
    {
      name:          'content_items',
      description:   'Content:',
      type:          Otter.FieldTypes.Repeater,
      nested_blocks: [
        html_block, // Supports name of block defined elsewhere
      ],
    },
  ],
}

export const block_with_repeater = {
  type:        'RepeaterDemo',
  description: 'Repeater Fields',
  fields:      [
    {
      name:          'content_items',
      description:   'Content:',
      item_headers:  true,
      type:          Otter.FieldTypes.Repeater,
      nested_blocks: [
        'Text', // Supports name of block defined elsewhere
        text_block_with_icon_tabs,
        text_block_with_normal_tabs,
        html_block, // Supports inline block object
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
      type:        Otter.FieldTypes.Searchable,
      search:      () => [{value: 'x', display: 'A search result'}],
    },
  ],
}
