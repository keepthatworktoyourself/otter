import '../src/css'
import React from 'react'
import ReactDOM from 'react-dom'
import Otter from '../src/index'
import {
  header_block,
  text_block,
  html_block,
  block_with_nested_block,
  block_with_repeater,
  searchables,
} from './blocks'


// blocksets
// -----------------------------------

const blocks__flat = [
  header_block,
  text_block,
  html_block,
  block_with_nested_block,
  block_with_repeater,
  searchables,
]

const blocks__grouped = {
  simple: {
    name:   'Headers',
    blocks: [header_block, text_block, html_block],
  },
  complex: {
    name:   'Content',
    blocks: [block_with_nested_block, block_with_repeater, searchables],
  },
}


// load - fake ajax request
// -----------------------------------

function load(post_id) {
  return Promise.resolve({
    json: () => [
      {
        __type:     'Header',
        heading:    'Otters',
        subheading: 'Otters? We got otters!',
        theme:      'light',
      },
      {
        __type: 'HTML',
        html:   `<div>I'm a TextArea field with mono={true}!</div>`,
      },
    ],
  })
}


// render
// -----------------------------------

function render(state, delegate) {
  ReactDOM.render(
    <Otter.Editor blocks={blocks__grouped}
                  data={state.data}
                  load_state={state.load_state}
                  delegate={delegate}
                  when_to_save={Otter.Save.OnInput}
                  block_numbers={true} />,
    document.querySelector('#otter-container'),
  )
}

const state = {
  data:       [],
  load_state: Otter.State.Loading,
}

const delegate = {
  save:          data => console.log('save()', data),
  block_toggled: () => console.log('block toggled'),
}

render(state, delegate)
load(state.post_id)
  .then(response => {
    state.data = response.json()
    state.load_state = Otter.State.Loaded
    render(state, delegate)
  })
  .catch(err => {
    console.log(err)
    state.load_state = Otter.State.Error
    render(state, delegate)
  })

