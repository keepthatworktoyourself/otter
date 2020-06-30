import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from 'iceberg-editor';
import 'iceberg-editor/dist/iceberg.css';


// Update
// -----------------------------------

const delegate = {
  on_update(data) {
    window.parent.postMessage({ 'iceberg--set-data': data });
    setTimeout(send_height_update, 10);
  },
};


// Render
// -----------------------------------

const state = {
  load_state: Iceberg.State.Loading,
  data: [ ],
  blocks: null,
};

function render() {
  ReactDOM.render(
    <Iceberg.Editor data={state.data}
             load_state={state.load_state}
             blockset={state.blocks}
             delegate={delegate}
             call_delegate={Iceberg.Save.OnInput} />,
    document.querySelector('.iceberg-container')
  );
}


// Fetch & kick off
// -----------------------------------

function do_error() {
  state.load_state = Iceberg.State.Error;
  render();
}

window.addEventListener('message', function(ev) {
  const proceed = ev.data && ev.data['iceberg--set-initial-data'];
  if (proceed) {
    state.load_state = Iceberg.State.Loaded;
    state.data = ev.data['iceberg--set-initial-data'];
    render();
  }
});

function load() {
  window.parent.postMessage({ 'iceberg--get-initial-data': true });
}


// Check height of iframe matches content
// -----------------------------------

function send_height_update() {
  window.parent.postMessage({
    'iceberg--set-height': getComputedStyle(document.body).height,
  });
}


// Run
// -----------------------------------

function run(blocks) {
  setInterval(send_height_update, 5000);

  render();
  state.blocks = blocks;
  load();
}

export default {
  run,
};

