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
]);

const blocks__all = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other
));

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


// // save
// // -----------------------------------
//
// function save() {
//   const url = `http://localhost/wp-content/themes/brandwatch/temp-backend--save.php`;
//   const data = this.get_plain_data();
//   console.log(data);
//   console.log(JSON.stringify(data));
//   const post_content = (
//     `post_id=${post_id}&` +
//     `data=${encodeURIComponent(JSON.stringify(data))}`
//   );
//
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     },
//     body: post_content,
//   }).then(response => console.log(response.json()));
// }


// Render

const delegate = {
  on_update(data) {
    console.log('on_update', data);
  },
};


const state = {
  // post_id: get_post_id(),
  load_state: null,
  data: [ ],
};


const post_parameter_supplied = true;


if (!post_parameter_supplied) {
  state.load_state = 'no post';
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
    <Otter.Editor data={state.data} load_state={state.load_state} delegate={delegate} blockset={blocks__all} />,
    document.getElementById('otter-container')
  );
}

