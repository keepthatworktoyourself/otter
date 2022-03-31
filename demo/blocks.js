import PencilSolid from 'simple-react-heroicons/icons/PencilSolid'
import CogSolid from 'simple-react-heroicons/icons/CogSolid'
import MenuAlt2Solid from 'simple-react-heroicons/icons/MenuAlt2Solid'
import MenuSolid from 'simple-react-heroicons/icons/MenuSolid'
import MenuAlt3Solid from 'simple-react-heroicons/icons/MenuAlt3Solid'
import Otter from '../src/index'
import Fields from '../src/core/definitions/fields'
import {dynamic_data, set_dynamic_data} from '../src/core/definitions/utils'

const horizontal_field_layout_classes = 'flex items-center justify-between'

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

const block_option_field_layout_classes = `pr-[30%] w-full ${horizontal_field_layout_classes}`

export const block_options = {
  type:   'BlockOptions',
  fields: [
    {
      name:          'top_padding',
      type:          Fields.Radios,
      wrapper_class: block_option_field_layout_classes,
      options:       {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:          'bottom_padding',
      type:          Fields.Radios,
      wrapper_class: block_option_field_layout_classes,
      options:       {
        small:  'Small',
        medium: 'Medium',
        large:  'Large',
      },
      default_value: 'medium',
    },
    {
      name:          'top_border',
      type:          Fields.Bool,
      wrapper_class: block_option_field_layout_classes,
      default_value: false,
    },
    {
      name:          'bottom_border',
      type:          Fields.Bool,
      wrapper_class: block_option_field_layout_classes,
      default_value: false,
    },
    {
      name:      'theme',
      type:      Otter.Fields.Radios,
      className: block_option_field_layout_classes,
      options:   {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          Fields.Radios,
      swatches:      true,
      className:     block_option_field_layout_classes,
      options:       dynamic_data('block_colors'),
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
      type: Otter.Fields.TextInput,
    },
    {
      name: 'url',
      type: Otter.Fields.TextInput,
    },
    {
      name:          'style',
      type:          Otter.Fields.Radios,
      wrapper_class: `w-[calc(50%-0.5rem)] pt-1 mr-[1rem] flex items-center`,
      label_class:   'mr-[10px]',
      description:   'Style',
      default_value: 'secondary',
      options:       {
        secondary: 'Secondary',
        primary:   'Primary',
      },
    },
    {
      name:          'newTab',
      type:          Otter.Fields.SelectMini,
      wrapper_class: `w-[calc(50%-0.5rem)] pt-1 flex items-center`,
      label_class:   'mr-[10px]',
      field_class:   'flex-1 w-full',
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
      name:               'btns__btn',
      type:               Otter.Fields.Repeater,
      add_item_label:     'Add a button',
      nested_block_types: [
        btn_block,
      ],
    },
  ],
}

const header_block_fields = [
  {
    name: 'label',
    type: Otter.Fields.TextInput,
  },
  {
    name: 'heading',
    type: Otter.Fields.TextInput,
  },
  {
    name:           'text',
    description:    'Text',
    type:           Otter.Fields.TextEditor,
    heading_levels: [1, 2, 3, 4, 5, 6],
    hr:             true,
    blockquote:     true,
  },
  {
    name:        'media_item',
    description: 'Image',
    type:        Otter.Fields.MediaPicker,
  },
  {
    name:                    'btns',
    description:             'Buttons (optional nested block)',
    type:                    Otter.Fields.NestedBlock,
    nested_block_type:       btns_block, // Supports name of block defined elsewhere
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
      type:           Otter.Fields.TextEditor,
      heading_levels: [1, 2, 3, 4, 5, 6],
      hr:             true,
      blockquote:     true,
    },
    {
      name:          'align',
      type:          Otter.Fields.Radios,
      wrapper_class: 'flex items-center space-x-4 pt-3 pb-1 mr-6',
      label_class:   'mb-0',
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
      type:          Otter.Fields.Bool,
      wrapper_class: 'flex items-center space-x-4 pt-3 pb-1',
      label_class:   'mb-0',
      default_value: false,
    },
    {
      name:          'display_if_example_target',
      description:   'If is true',
      type:          Otter.Fields.SelectMini,
      wrapper_class: 'pb-2 w-full',
      swatches:      true,
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
      type:        Otter.Fields.TextArea,
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
      type: Otter.Fields.TextInput,
    },
    {
      name: 'heading',
      type: Otter.Fields.TextInput,
    },
    {
      name: 'text',
      type: Otter.Fields.TextArea,
    },
    {
      name:        'some_select',
      description: 'Select',
      type:        Otter.Fields.Select,
      options:     {
        one: 'Option 1',
        two: 'Option 2',
      },
      default_value: 'one',
    },
    {
      name:          'theme',
      type:          Otter.Fields.Radios,
      wrapper_class: block_option_field_layout_classes,
      options:       {
        light: 'Light',
        dark:  'Dark',
      },
      default_value: 'light',
    },
    {
      name:          'color',
      type:          Fields.Radios,
      swatches:      true,
      wrapper_class: block_option_field_layout_classes,
      options:       dynamic_data('block_colors'),
      default_value: dynamic_data('default_block_color'),
    },
  ],
}

export const block_with_nested_block = {
  type:        'NestedBlockDemo',
  description: 'Nested Blocks',
  fields:      [
    {
      name:              'tabs_demo',
      description:       'Tabs',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: tabs_demo_block, // Supports inline block object
      seamless:          true,
      initially_open:    false,
    },
    {
      name:              'text_content',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: text_block, // Supports inline block object
      seamless:          false,
      initially_open:    false,
    },
    {
      name:                    'searchable',
      type:                    Otter.Fields.NestedBlock,
      description:             'Searchable (Seamless Nested Block)',
      nested_block_type:       'SearchablesDemo', // Supports name of block defined elsewhere
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
      name:               'content_items',
      description:        'Content:',
      type:               Otter.Fields.Repeater,
      nested_block_types: [
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
      name:               'content_items',
      description:        'Content:',
      item_headers:       true,
      type:               Otter.Fields.Repeater,
      nested_block_types: [
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
      type:        Otter.Fields.Searchable,
      search:      () => [{value: 'x', display: 'A search result'}],
    },
  ],
}
