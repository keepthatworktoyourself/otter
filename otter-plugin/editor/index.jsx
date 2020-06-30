import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from 'iceberg-editor'
import 'iceberg-editor/dist/iceberg.css';


// Define blocks
// -----------------------------------

const blocks__header = Iceberg.Blockset([
  {
    type: 'Header',
    description: 'Header',
    fields: [
      {
        name:        'title',
        description: 'Title',
        type:        Iceberg.Fields.TextInput,
      },
      {
        name:        'author',
        description: 'Author',
        type:        Iceberg.Fields.TextInput,
      },
    ],
  },
]);

const blocks__content = Iceberg.Blockset([
  {
    type: 'Text',
    description: 'Text content',
    fields: [
      {
        name:        'content',
        description: 'Content',
        type:        Iceberg.Fields.TextArea,
      },
    ],
  },
]);

const blocks__other = Iceberg.Blockset([
  {
    type: 'MultiContent',
    description: 'Multiple content items',
    fields: [
      {
        name:           'content_items',
        description:    'Content:',
        type:           Iceberg.Fields.SubBlockArray,
        subblock_types: [ blocks__content.get('Text') ],
      },
    ],
  },
]);

const post_type = location.search.match(/post_type=([^&]+)/)[1];

const blocks__all = Iceberg.Blockset([].concat(
  blocks__header,
  blocks__content,
  post_type === 'bw_landing_page' ? blocks__other : [ ]
));


// Update
// -----------------------------------

const delegate = {
  on_update(data) {
    window.parent.postMessage({
      'iceberg-data': data,
    });

    setTimeout(send_height_update, 10);
  },
};


// Render
// -----------------------------------

const state = {
  load_state: Iceberg.State.Loading,
  data: [ ],
};

function render() {
  ReactDOM.render(
    <Iceberg.Editor data={state.data}
             load_state={state.load_state}
             blockset={blocks__all}
             delegate={delegate}
             call_delegate={Iceberg.Save.OnInput} />,
    document.querySelector('.iceberg-container')
  );
}


// Fetch & kick off
// -----------------------------------

render();

function do_error() {
  state.load_state = Iceberg.State.Error;
  render();
}

window.addEventListener('message', function(ev) {
  if (ev.data && ev.data['iceberg-initial']) {
    state.load_state = Iceberg.State.Loaded;
    state.data = ev.data['iceberg-initial'];
    render();
  }
});

function load() {
  window.parent.postMessage({
    'iceberg-initial': true,
  });
}

load();


// Check height of iframe matches content
// -----------------------------------

function send_height_update() {
  const data = { 'set-height': getComputedStyle(document.body).height };

  window.parent.postMessage(
    data,
    `${location.protocol}//${location.host}`
  );
}

setInterval(send_height_update, 2000);

