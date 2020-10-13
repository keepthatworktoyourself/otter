import React from 'react';
import ReactDOM from 'react-dom';
import Otter from '../src/index';
import '../src/css';


// Define blocks
// -----------------------------------

const header_block = {
  type: 'Header',
  description: 'Header',
  fields: [
    {
      name:        'heading',
      description: 'Heading',
      type:        Otter.Fields.TextInput,
    },
    {
      name:        'subheading',
      description: 'Catchy subtitle',
      type:        Otter.Fields.TextInput,
    },
    {
      name:        'theme',
      description: 'Theme',
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
      name:        'content',
      description: 'Content',
      type:        Otter.Fields.TextEditor,
    },
    {
      name:        'fancy',
      description: 'Fancy lettering',
      type:        Otter.Fields.Bool,
      text__yes:   'Sure',
      text__no:    'No, plain',
    },
    {
      name:        'align',
      description: 'Align',
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
    },
  ],
};

const block_with_subblock = {
  type: 'SubBlockDemo',
  description: 'Block with subblocks',
  fields: [
    {
      name:          'heading',
      description:   'Heading',
      type:          Otter.Fields.SubBlock,
      subblock_type: header_block,
    },
    {
      name:          'text_content',
      description:   'Content',
      type:          Otter.Fields.SubBlock,
      subblock_type: text_block,
      optional:      true,
    },
  ],
};

const block_with_subblock_array = {
  type: 'SubBlockArrayDemo',
  description: 'Block with subblock array',
  fields: [
    {
      name:           'content_items',
      description:    'Content:',
      type:           Otter.Fields.SubBlockArray,
      subblock_types: [ text_block, html_block ],
    },
  ],
};


// Blocks can be a flat array or nested in groups
const blocks__flat = [
  header_block,
  text_block,
  html_block,
  block_with_subblock,
  block_with_subblock_array,
];

const blocks__nested = {
  simple: {
    name:   'Headers',
    blocks: [ header_block ],
  },
  complex: {
    name:   'Content',
    blocks: [ block_with_subblock, block_with_subblock_array ],
  },
};


// load
// -----------------------------------

function load(post_id) {
  // NB - Fake ajax request for demo purposes.
  //    - A real application would `return fetch(url)` or similar.

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
        content: 'Every work of art is the child of its age and, in many cases, the mother of our emotions...',
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
  }
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
    <Otter.Editor blocks={blocks__flat} data={state.data} load_state={state.load_state} delegate={delegate} save={Otter.Save.OnInput} />,
    document.getElementById('otter-container')
  );
}

