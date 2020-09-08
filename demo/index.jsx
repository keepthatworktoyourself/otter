import React from 'react';
import ReactDOM from 'react-dom';
import Otter from '../src/index';
import '../src/css';


// Define blocks
// -----------------------------------

const blocks__header = Otter.Blockset([
  {
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
        name: 'theme',
        description: 'Theme',
        type: Otter.Fields.Radios,
        options: {
          light: 'Light',
          dark: 'Dark',
        },
      },
    ],
  },
]);

const blocks__content = Otter.Blockset([
  {
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
  },
  {
    type: 'HTML',
    description: 'Raw HTML',
    fields: [
      {
        name:        'html',
        description: 'HTML',
        type:        Otter.Fields.TextArea,
      },
    ],
  },
]);


const blocks__other = Otter.Blockset([
  {
    type: 'MultiContent',
    description: 'Multiple content items',
    fields: [
      {
        name:           'content_items',
        description:    'Content:',
        type:           Otter.Fields.SubBlockArray,
        subblock_types: [ blocks__content.get('Text') ],
      },
    ],
  },
  {
    type: 'HeadingWithText',
    description: 'Heading with text',
    fields: [
      {
        name:          'heading',
        description:   'Heading',
        type:          Otter.Fields.SubBlock,
        subblock_type: blocks__header.get('Header'),
      },
      {
        name:          'text_content',
        description:   'Content',
        type:          Otter.Fields.SubBlock,
        subblock_type: blocks__content.get('Text'),
        optional:      true,
      },
    ],
  },
]);

const blocks__flat = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other,
));

const blocks__nested = Otter.Blockset({
  simple: {
    name:   'Headers',
    blocks: blocks__header,
  },
  complex: {
    name:   'Content',
    blocks: blocks__other,
  },
});


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
      },
      {
        __type: 'Text',
        content: 'Every work of art is the child of its age and, in many cases, the mother of our emotions...',
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
    <Otter.Editor data={state.data} load_state={state.load_state} delegate={delegate} blockset={blocks__flat} save={Otter.Save.OnInput} />,
    document.getElementById('otter-container')
  );
}

