import React from 'react';
import ReactDOM from 'react-dom';
import Otter from 'otter-editor';


function container() {
  return document.querySelector('.otter-container');
}


// Update
// -----------------------------------

const delegate = {
  save(data) {
    window.parent.postMessage({ 'otter--set-data': data });
  },

  block_toggled() {
    setTimeout(send_height_update, 10);
  },
};


// Render
// -----------------------------------

const state = {
  load_state: Otter.State.Loading,
  data: [ ],
  blocks: null,
  iframe_container_info: { },
};

function render() {
  render.component = ReactDOM.render(
    <Otter.Editor
             data={state.data}
             load_state={state.load_state}
             blocks={state.blocks}
             block_numbers={true}
             delegate={delegate}
             save={Otter.Save.OnInput}
             iframe_container_info={state.iframe_container_info} />,
    container()
  );
}


// Dynamic data
// -----------------------------------

Otter.Utils.dynamic_data.request_from_iframe = true

window.addEventListener('message', function(ev) {
  const proceed = ev.data && ev.data['otter--set-dynamic-data'];
  if (proceed) {
    const item = ev.data['otter--set-dynamic-data'];
    Otter.Utils.set_dynamic_data(item.name, item.value);
    render.component.forceUpdate();
  }
});


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


// Send iframe height
// -----------------------------------

function send_height_update() {
  window.parent.postMessage({
    'otter--set-height': getComputedStyle(container()).height,
  });
}


// Update y offset for block picker
// -----------------------------------

window.addEventListener('message', function(ev) {
  const proceed = ev.data && ev.data.hasOwnProperty('otter--set-iframe-container-info');
  if (proceed) {
    state.iframe_container_info = ev.data['otter--set-iframe-container-info'];
    render();
  }
});


// Run
// -----------------------------------

function init(blocks) {
  setInterval(send_height_update, 5000);

  render();
  state.blocks = blocks;
  load();
}

export default {
  init,
};

