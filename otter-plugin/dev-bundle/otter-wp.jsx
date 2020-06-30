import React from 'react';
import ReactDOM from 'react-dom';
import Otter from 'otter-editor';
import 'otter-editor/dist/otter.css';


// Update
// -----------------------------------

const delegate = {
  on_update(data) {
    window.parent.postMessage({ 'otter--set-data': data });
    setTimeout(send_height_update, 10);
  },
};


// Render
// -----------------------------------

const state = {
  load_state: Otter.State.Loading,
  data: [ ],
  blocks: null,
};

function render() {
  ReactDOM.render(
    <Otter.Editor data={state.data}
             load_state={state.load_state}
             blockset={state.blocks}
             delegate={delegate}
             call_delegate={Otter.Save.OnInput} />,
    document.querySelector('.otter-container')
  );
}


// Fetch & kick off
// -----------------------------------

function do_error() {
  state.load_state = Otter.State.Error;
  render();
}

window.addEventListener('message', function(ev) {
  const proceed = ev.data && ev.data['otter--set-initial-data'];
  if (proceed) {
    state.load_state = Otter.State.Loaded;
    state.data = ev.data['otter--set-initial-data'];
    render();
  }
});

function load() {
  window.parent.postMessage({ 'otter--get-initial-data': true });
}


// Check height of iframe matches content
// -----------------------------------

function send_height_update() {
  window.parent.postMessage({
    'otter--set-height': getComputedStyle(document.body).height,
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

