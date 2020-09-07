import React from 'react';
import ReactDOM from 'react-dom';
import Otter from '../src/index';
import '../src/css';


// Define the blockset for the content editor

const blocks__header = Otter.Blockset([
  {
    type: 'Header',
    description: 'Header',
    fields: [
      {
        name:        'title',
        description: 'Title',
        type:        Otter.Fields.TextInput,
      },
      {
        name:        'author',
        description: 'Author',
        type:        Otter.Fields.TextInput,
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
]);

const blocks__flat = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other,
));

const block__nested = Otter.Blockset({
  simple: {
    name: 'Simple blocks',
    blocks: blocks__header.concat(blocks__content),
  },
  complex: {
    name: 'Complicated blocks',
    blocks: blocks__other,
  },
});


// function get_query_data() {
//   const q = window.location.search;
//   if (!q || !q.length) {
//     return null;
//   }
//
//   return q.substr(1)
//     .split('&')
//     .reduce(function(accum, item) {
//       const parts = item.split('=');
//       accum[parts[0]] = parts[1];
//       return accum;
//     }, { });
// }
//
//
// function get_post_id() {
//   const data = get_query_data();
//   return data ? (data.post_id || null) : null;
// }


// load
// -----------------------------------

function load(post_id) {
  // NB - Fake ajax request for demo purposes.
  //    - A real application would `return fetch(url)` or similar.

  return Promise.resolve({
    json: () => [
      {
        __type: 'Header',
        title: 'Concerning the spiritual in art',
        author: 'Wassily Kandinsky',
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
    console.log('on_update', data);
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

