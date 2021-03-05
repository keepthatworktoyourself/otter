import React from 'react';
import ReactDOM from 'react-dom';
import Otter from '../src/index';
import '../src/css';


// Define blocks
// -----------------------------------

const header_block = {
  type: 'Header',
  fields: [
    Otter.Fields.mk_textinput('heading'),
    Otter.Fields.mk_textinput('subheading', 'Catchy subheading'),
    {
      name:        'theme',
      type:        Otter.Fields.Radios,
      options: {
        light: 'Light',
        dark:  'Dark',
      },
    },
  ],
};

const text_block = {
  type: 'Text',
  description: 'Text content',
  fields: [
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
      name:        'align',
      type:        Otter.Fields.Select,
      options: {
        left:   'Left',
        right:  'Right',
        center: 'Center',
      },
    },
  ],
};

const html_block = {
  type: 'HTML',
  description: 'Raw HTML',
  fields: [
    {
      name:        'html',
      description: 'HTML',
      type:        Otter.Fields.TextArea,
      mono:        true,
    },
  ],
};

const block_with_nested_block = {
  type: 'NestedBlockDemo',
  description: 'Block demonstrating NestedBlock fields',
  fields: [
    {
      name:              'heading',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: 'Header',       // Supports string block-type references
    },
    {
      name:              'text_content',
      type:              Otter.Fields.NestedBlock,
      nested_block_type: text_block,    // Supports inline block definitions
      optional:          true,
    },
  ],
};

const block_with_repeater = {
  type: 'RepeaterDemo',
  description: 'Block demonstrating Repeater fields',
  fields: [
    {
      name:           'content_items',
      description:    'Content:',
      type:           Otter.Fields.Repeater,
      nested_block_types: [
        'Text',            // Also supports both strings and objects
        html_block,        //
      ],
    },
  ],
};


// Blocks can be a flat array or nested in groups
const blocks__flat = [
  header_block,
  text_block,
  html_block,
  block_with_nested_block,
  block_with_repeater,
];

const blocks__nested = {
  simple: {
    name:   'Headers',
    blocks: [ header_block, text_block, html_block ],
  },
  complex: {
    name:   'Content',
    blocks: [ block_with_nested_block, block_with_repeater ],
  },
};


// load
// -----------------------------------

function load(post_id) {
  // NB - Fake ajax request for demo purposes.
  //    - A real application would return `fetch(api_url)` or similar.

  return Promise.resolve({
    json: () => [
      {
        __type:     'Header',
        heading:    'Concerning the spiritual in art',
        subheading: 'Wassily Kandinsky',
        theme:      'light',
      },
      {
        __type: 'Text',
        content: '<p>Every work of <b>art</b> is the child of its age and, in many cases, the mother of our emotions...</p>',
        fancy:   true,
        align:   'center',
      },
    ],
  });
}


// cb_load
// -----------------------------------

function cb_load(data) {
  if (!data) {
    throw Error('cb_load called but data object missing');
  }

  state.load_state = Otter.State.Loaded;
  state.data = data || [ ];
}


// Render
// -----------------------------------

const delegate = {
  save(data) {
    console.log('save()', data);
  },
  block_toggled() {
    console.log('block toggled');
  },
};


const state = {
  load_state: null,
  data: [ ],
  post_parameter_supplied: true,   // Toggle to simulate error
};


if (!state.post_parameter_supplied) {
  state.load_state = Otter.State.Error;
  render();
}
else {
  state.load_state = Otter.State.Loading;
  render();
  load(state.post_id)
    .then(response => response.json())
    .then(cb_load)
    .then(data => {
      state.load_state = Otter.State.Loaded;
      return data;
    })
    .then(render)
    .catch(err => {
      console.log(err);
      state.load_state = Otter.State.Error;
      render();
    });
}


function render() {
  ReactDOM.render(
    <Otter.Editor blocks={blocks__nested} data={state.data} load_state={state.load_state} delegate={delegate} save={Otter.Save.OnInput} />,
    document.getElementById('otter-container')
  );
}

