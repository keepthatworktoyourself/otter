import '../src/css'
import React, {useRef, useState} from 'react'
import ReactDOM from 'react-dom'
import Otter from '../src/index'
import {
  header_block,
  text_block,
  html_block,
  block_with_nested_block,
  block_with_repeater,
  searchables,
  block_with_repeater_one_type,
} from './blocks'
import OBtn from '../src/core/components/default-ui/OBtn'
import classes from '../src/core/definitions/classes'
import {classNames} from '../src/core/helpers/style'
import data from './data'
import custom_classes from './custom-classes'


// blocksets
// -----------------------------------

const blocks__flat = [
  header_block,
  text_block,
  html_block,
  block_with_nested_block,
  block_with_repeater_one_type,
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


// load - fake async request
// -----------------------------------

function load(post_id) {
  return Promise.resolve({
    json: () => data,
  })
}

// render
// -----------------------------------

function App({state}) {
  const [picker_mode, set_picker_mode] = useState('modal')
  const [test_custom_classes_enabled, set_test_custom_classes_enabled] = useState(false)
  const modal_portal = useRef()

  const output_blocks = picker_mode === 'popover' ? blocks__flat : blocks__grouped

  return (
    <div className="px-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <div className={classNames(
            classes.skin.border_color,
            'w-5/12 relative flex flex-col border-r',
            'pr-20 min-h-screen',
          )}
          >
            <div className="absolute top-0 bottom-0 right-0 bg-zinc-900"
                 style={{left: '-100vw'}} />
            <div className="pt-28 relative">
              <h1 className={classNames(classes.typography.heading, 'mb-10')}
                  style={{
                    fontSize:      '50px',
                    fontWeight:    '800',
                    letterSpacing: '-0.05em',
                    lineHeight:    '0.7',
                    color:         'white',
                  }}
              >
                Otter
                <img src="https://github.com/keepthatworktoyourself/otter/raw/int/files/otter.png"
                     style={{width: '80px', display: 'inline-block', verticalAlign: 'baseline', position: 'relative', top: '16px'}}
                     className="ml-5" />
              </h1>
              <p className={classes.typography.sub_heading}
                 style={{
                   opacity: 0.6,
                   color:   'white',
                 }}
              >
                Otter is perhaps the <s>furriest</s> easiest way in the universe to
                embed a content editor in your react/preact application.
              </p>
            </div>
          </div>
          <div className="w-7/12 min-h-screen">
            <div className={classNames(
              'text-xxs',
              'flex items-center space-x-8',
              classes.skin.border_color,
              'px-12',
              'border-b py-4 md:py-8',
            )}
            >
              <div className="flex items-center space-x-3">
                <div className={classes.typography.heading}>Picker Mode</div>
                <OBtn label="Popover"
                      buttonStyle={picker_mode === 'popover' ? 'primary' : 'secondary'}
                      onClick={() => set_picker_mode('popover')} />
                <OBtn label="Modal"
                      buttonStyle={picker_mode === 'modal' ? 'primary' : 'secondary'}
                      onClick={() => set_picker_mode('modal')} />
              </div>
              <div className="flex items-center space-x-3">
                <div className={classes.typography.heading}>Theme</div>
                <OBtn label="Custom Classes"
                      buttonStyle={test_custom_classes_enabled ? 'primary' : 'secondary'}
                      onClick={() => set_test_custom_classes_enabled(!test_custom_classes_enabled)} />
              </div>
            </div>
            <div className="px-12">
              <Otter.Editor key={picker_mode} // re-render on demo mode change
                            data={state.data}
                            blocks={output_blocks}
                            custom_classes={test_custom_classes_enabled && custom_classes}
                            load_state={state.load_state}
                            save={save}
                            update_height={update_height}
                            open_media_library={open_media_library}
                            picker_container_ref={modal_portal}
                            block_numbers={false} />
            </div>
          </div>
        </div>
      </div>

      <div ref={modal_portal}
           style={{zIndex: 999999}}
           className="relative" />
    </div>
  )
}

function render(state) {
  ReactDOM.render(
    <App state={state} />,
    document.querySelector('#otter-container'),
  )
}

const state = {
  data:       [],
  load_state: Otter.State.Loading,
}

function save(data) {
  console.log('save()', JSON.stringify(data, null, 2))
}

function update_height() {
  console.log('height changed')
}

function open_media_library(set_value) {
  console.log('open media library')
  setTimeout(() => {
    set_value({
      url:       'http://placekitten.com/500/400',
      thumbnail: 'http://placekitten.com/500/400',
    })
  })
}

render(state)
load(state.post_id)
  .then(response => {
    state.data = response.json()
    state.load_state = Otter.State.Loaded
    render(state)
  })
  .catch(err => {
    console.log(err)
    state.load_state = Otter.State.Error
    render(state)
  })
