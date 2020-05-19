import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from '../src/index';


// Define the blockset for the content editor

const blockset = Iceberg.Blockset([
  {
    type: 'HeaderBlock',
    description: 'Heading',
    fields: [
      { name: 'title', description: 'Title', type: Iceberg.Fields.TextInput },
      { name: 'author', description: 'Author', type: Iceberg.Fields.TextInput },
    ],
  },
  {
    type: 'TextBlock',
    description: 'Text content',
    fields: [
      { name: 'content', description: 'Content', type: Iceberg.Fields.TextArea },
    ],
  },
]);


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
        __type: 'HeaderBlock',
        title: 'Concerning the spiritual in art',
        author: 'Wassily Kandinsky',
      },
      {
        __type: 'TextBlock',
        content: 'Every work of art is the child of its age and, in many cases, the mother of our emotions...',
      }
    ],
  });
}


// cb_load
// -----------------------------------

function cb_load(data) {
  if (!data) {
    throw Error('cb_load called but data object missing');
  }

  state.load_state = 'loaded';
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

const ext_interface = {
  on_update: function(data) {
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
  state.load_state = 'loading';
  render();
  load(state.post_id)
    .then(response => response.json())
    .then(cb_load)
    .then(data => { state.load_state = 'loaded'; return data; })
    .then(render)
    .catch(err => { console.log(err); state.load_state = 'error'; render(); })
}


function render() {
  ReactDOM.render(
    <Iceberg data={state.data} load_state={state.load_state} ext_interface={ext_interface} blockset={blockset} />,
    document.getElementById('iceberg-container')
  );
}

