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
import demo_custom_classes from './demo-custom-classes'

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

// load - fake ajax request
// -----------------------------------

function load(post_id) {
  return Promise.resolve({
    json: () => [
      {
        __type:     'Header',
        heading:    'Otters',
        subheading: 'Otters? We got otters!',
      },
      {
        __type:        'RepeaterDemo',
        content_items: [
          {
            __type: 'Text',
          },
          {
            __type: 'Text',
          },
        ],
      },
      {
        __type:  'NestedBlockDemo',
        heading: {
          __type:     'Header',
          heading:    'Nested Heading',
          subheading: 'Nested Sub-Heading',
        },
        text_content: {
          __type:  'Text',
          content: '<p>Hi</p>',
        },
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

function App({state, delegate}) {
  const [picker_mode, set_picker_mode] = useState('popover')
  const [test_custom_classes_enabled, set_test_custom_classes_enabled] = useState(false)
  const modal_portal = useRef()

  return (
    <div className="px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <div className={classNames(
            classes.skin.border_color,
            'w-5/12 relative flex flex-col border-r',
            'pr-20 min-h-screen',
          )}
          >
            <div className="absolute top-0 bottom-0 right-0 bg-gray-900"
                 style={{left: '-100vw'}}
            ></div>
            <div className="pt-32 relative">
              {/* <img src="https://github.com/keepthatworktoyourself/otter/raw/int/files/otter.png"
                   style={{maxWidth: '100px'}}
                   className="mb-3" /> */}
              {/* <img src="https://res.cloudinary.com/drtjqpz13/image/upload/v1637173136/Wombat/otter-test.svg"
                   style={{maxWidth: '150px'}}
                   className="mb-3" /> */}
              <h1 className={classNames(classes.typography.heading, 'mb-6')}
                  style={{
                    fontSize:      '50px',
                    fontWeight:    '800',
                    letterSpacing: '-0.07em',
                    lineHeight:    '0.7',
                    color:         'white',
                  }}
              >
                Otter.
              </h1>
              <p className={classes.typography.sub_heading}
                 style={{
                   opacity: 0.6,
                   color:   'white',
                 }}
              >
                Otter is perhaps the furriest, easiest way in the universe to
                embed a content editor in your react/preact application.
              </p>

              {/* <div className="relative flex-1 text-xxxs mt-10">
                <div style={{maxWidth: '45rem', minHeight: '600px'}}
                     className="absolute-fill overflow-scroll border px-4 pt-4 border-gray-200 bg-gray-100"
                >
                  <pre>data:{JSON.stringify(state.data, null, 2)}</pre>
                  <pre>blocks:{JSON.stringify(blocks__grouped, null, 2)}</pre>
                </div>
              </div> */}
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
                            blocks={
                  picker_mode === 'popover' ? blocks__flat : blocks__grouped
                }
                            custom_classes={test_custom_classes_enabled && demo_custom_classes}
                            load_state={state.load_state}
                            delegate={delegate}
                            when_to_save={Otter.Save.OnInput}
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

function render(state, delegate) {
  ReactDOM.render(
    <App state={state} delegate={delegate} />,
    document.querySelector('#otter-container'),
  )
}

const state = {
  data:       [],
  load_state: Otter.State.Loading,
}

const delegate = {
  save:                 data => console.log('save()', JSON.stringify(data, null, 2)),
  editor_height_change: () => console.log('block toggled'),
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
