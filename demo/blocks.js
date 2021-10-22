import Otter from '../src/index'

export const header_block = {
  type:   'Header',
  fields: [
    Otter.Fields.mk_textinput('heading'),
    Otter.Fields.mk_textinput('subheading', 'Catchy subheading'),
    {
      name:    'theme',
      type:    Otter.Fields.Radios,
      options: {
        light: 'Light',
        dark:  'Dark',
      },
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
      type:           Otter.Fields.TextEditor,
      heading_levels: [1, 2, 3, 4, 5, 6],
      hr:             true,
      blockquote:     true,
    },
    {
      name:        'fancy',
      description: 'Fancy lettering',
      type:        Otter.Fields.Bool,
      yes_label:   'Sure',
      no_label:    'No, plain',
    },
    {
      name:     'dropcap_color',
      type:     Otter.Fields.Radios,
      swatches: true,
      options:  {
        'pink':       '#f06292',
        'purple':     '#9575cd',
        'light blue': '#4fc3f7',
        'cyan':       '#4dd0e1',
        'amber':      '#ffd54f',
        'yellow':     '#fff176',
      },
      display_if: {
        sibling:  'fancy',
        equal_to: true,
      },
    },
    {
      name:    'align',
      type:    Otter.Fields.Select,
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
      type:        Otter.Fields.TextArea,
      mono:        true,
    },
  ],
}

export const block_with_nested_block = {
  type:        'NestedBlockDemo',
  description: 'Block demonstrating NestedBlock fields',
  fields:      [
    {
      name:              'heading',
      type:              Otter.Fields.NestedBlock,
      optional:          true,
      nested_block_type: 'Header',  // Supports name of block defined elsewhere
    },
    {
      name:              'text_content',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: text_block,  // Supports inline block object
      optional:          true,
    },
  ],
}

export const block_with_repeater = {
  type:        'RepeaterDemo',
  description: 'Block demonstrating Repeater fields',
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
  type:   'SearchablesDemo',
  fields: [
    {
      name:        'my_searchable',
      description: 'Search for something',
      type:        Otter.Fields.Searchable,
      search:      () => [
        {value: 'x', display: 'A search result'},
      ],
    },
  ],
}
