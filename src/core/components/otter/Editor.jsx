import React, {useState, useReducer, useEffect, useMemo} from 'react'
import ReactDOM from 'react-dom'
import * as DnD from 'react-beautiful-dnd'
import {AnimatePresence, motion} from 'framer-motion'
import {PageDataContext} from '../../contexts/PageDataContext'
import Fields from '../../definitions/fields'
import {
  copy,
  evaluate,
  find_block_def,
  display_if,
  uid,
  iterate,
  iterate_data,
  blocks_are_grouped,
} from '../../definitions/utils'
import State from '../../definitions/state'
import Block from './Block/Block'
import {classNames} from '../../helpers/style'
import AddBlockBtn from './Block/AddBlockBtn'
import Modal from '../primitives/Modal'
import BlockPicker from './other/BlockPicker'
import animations from '../../definitions/animations'
import design_options from '../../definitions/design-options'
import classes from '../../definitions/classes'
import {ThemeContext} from '../../contexts/ThemeContext'
import {useOnFirstRender} from '../../hooks/useOnFirstRender'
import merge from '../../helpers/merge'

function field_type_supports_empty_string_value(field_type) {
  return [Fields.TextInput, Fields.TextArea].includes(field_type)
}

function export_block_data(block_data, block_defs) {
  if (!block_data) {
    return null
  }

  const block_def = find_block_def(block_defs, block_data.__type)
  if (!block_def) {
    return null
  }

  const fields__displayed = (block_def.fields || []).filter(field_def => {
    const {display, errors} = display_if(block_def, field_def.name, block_data)

    if (errors.length > 0) {
      errors.forEach(err => console.error(err))
    }

    return display === true
  })

  return fields__displayed.reduce((carry, field_def) => {
    const {name: field_name, type: field_type} = field_def
    const field_value                          = block_data[field_name]
    const supports_empty_string_value          = field_type_supports_empty_string_value(field_type)

    if (field_type === Fields.NestedBlock || field_type === Fields.Repeater) {
      if (field_type === Fields.Repeater) {
        carry[field_name] = (field_value || []).map(block_data => {
          return export_block_data(block_data, block_defs)
        })
      }
      else if (field_type === Fields.NestedBlock) {
        carry[field_name] = export_block_data(field_value, block_defs)
      }

      if (field_def.optional) {
        carry[field_name]['__enabled'] = !!field_value['__enabled']
      }
    }

    else {
      const use_default =
        field_value === null ||
        field_value === undefined ||
       (field_value === '' && !supports_empty_string_value)

      carry[field_name] = use_default ?
        evaluate(field_def.default_value) :
        field_value
    }

    const val = carry[field_name]
    const remove = (
      (val === '' && !supports_empty_string_value) ||
      val === null ||
      val === undefined ||
      val.constructor === Array && val.length === 0 ||
      field_name === '__type' ||
      field_name === '__uid'
    )
    if (remove) {
      delete carry[field_name]
    }

    return carry
  }, {__type: block_def.type})
}

function ensure_uids(data) {
  iterate_data(data, block_data => {
    if (block_data && !block_data.__uid) {
      block_data.__uid = uid()
    }
  })
}

function ensure_display_ifs_are_arrays(block_defs) {
  iterate(block_defs, item => {
    if (item && item.display_if && item.display_if.constructor !== Array) {
      item.display_if = [item.display_if]
    }
  })
}

const Msg = msg => (
  <div className={classNames('p-4 text-center', classes.typography.copy)}>
    {msg}
  </div>
)

function ctx_reducer(state, op) {
  if (!state.data) {
    state.data = []
  }

  if (op?.set_data) {
    state.data = op.set_data
  }

  else if (op?.add_item) {
    const {type, index, block_defs} = op.add_item
    const block_def = find_block_def(block_defs, type)
    const initial_data = block_def.initial_data || {}
    const block_data = {...initial_data, __type: type}

    typeof index === 'number' ?
      state.data.splice(index, 0, block_data) :
      state.data.push(block_data)
  }

  else if (op?.delete_item) {
    const {index} = op.delete_item
    state.data.splice(index, 1)
  }

  else if (op?.reorder) {
    const drag_result = op.reorder
    const proceed = (
      drag_result.destination && drag_result.source &&
      drag_result.source.index !== drag_result.destination.index
    )
    if (proceed) {
      const [item] = state.data.splice(drag_result.source.index, 1)
      state.data.splice(drag_result.destination.index, 0, item)
    }
  }

  return {data: state.data, block_defs: state.block_defs}
}


// Editor
// -----------------------------------

export default function Editor({
  blocks: block_defs = [],
  data = [],
  load_state,
  block_numbers,
  can_add_blocks = true,
  DragDropContext = DnD.DragDropContext,
  Droppable = DnD.Droppable,
  ContextProvider = PageDataContext.Provider,
  picker_container_ref,
  iframe_container_info = { },
  custom_classes,
  custom_design_options,
  save,
  update_height,
  open_media_library,
  dev_mode,
}) {
  const valid_state = Object.values(State).includes(load_state)
  const [block_picker, set_block_picker] = useState(false)
  const [block_to_insert, set_block_to_insert] = useState({index: 0, type: null})
  const [previous_load_state, set_previous_load_state] = useState(null)
  const [_, update] = useState({ })
  const initial_data = useMemo(() => copy(data), [])
  const [ctx, dispatch_ctx] = useReducer(ctx_reducer, {data: initial_data, block_defs})
  const first_render = useOnFirstRender()

  function enqueue_save_on_input() {
    setTimeout(do_save)
  }
  function add_item(type, index) {
    dispatch_ctx({add_item: {type, index, block_defs: ctx.block_defs}})
    enqueue_save_on_input()
    do_update_height()
  }
  function delete_item(index) {
    dispatch_ctx({delete_item: {index}})
    enqueue_save_on_input()
    do_update_height()
  }
  function reorder_items(drag_result) {
    dispatch_ctx({reorder: drag_result})
    enqueue_save_on_input()
  }
  function redraw() {
    update({ })
  }
  function do_update_height() {
    update_height?.()
  }
  function do_open_media_library(set_value_callback) {
    open_media_library?.(set_value_callback)
  }
  function open_block_picker(block_index) {
    set_block_to_insert({ })
    set_block_picker_state(block_index)
  }
  function close_block_picker() {
    set_block_picker(false)
  }
  function insert_block() {
    if (!block_to_insert?.type || (!block_to_insert?.index && block_to_insert.index !== 0)) return
    add_item(block_to_insert.type, block_to_insert.index)
  }

  useEffect(() => {
    if (!first_render) {
      dispatch_ctx({set_data: data})
    }
  }, [data])

  useEffect(() => {
    // Blocks are inserted AFTER the block picker
    // closes, but BEFORE the closing animation has ended
    if (block_picker === false) {
      setTimeout(insert_block, 150)
    }
  }, [block_picker])

  const ctx_interface = {
    update_height:      do_update_height,
    value_updated:      enqueue_save_on_input,
    open_media_library: do_open_media_library,
    redraw,
    add_item,
    delete_item,
    open_block_picker,
    close_block_picker,
    can_add_blocks,
    dev_mode,
  }

  function get_data() {
    return (ctx.data || []).map(block_data => export_block_data(block_data, ctx.block_defs))
  }

  function set_block_picker_state(open) {
    set_block_picker(open)
    window.scrollY,
    do_update_height()
  }

  function do_save() {
    save?.(get_data())
  }

  ensure_uids(ctx.data)
  ensure_display_ifs_are_arrays(ctx.block_defs)

  if (load_state === State.Loaded && previous_load_state !== State.Loaded) {
    do_update_height()
  }
  if (load_state !== previous_load_state) {
    set_previous_load_state(load_state)
  }

  const show_block_picker = (
    can_add_blocks &&
    load_state === State.Loaded &&
    block_picker !== false &&
    blocks_are_grouped(ctx.block_defs)
  )

  const n_items = ctx.data?.length || 0

  return (
    <ThemeContext.Provider value={{
      classes:        merge(classes, custom_classes),
      design_options: merge(design_options, custom_design_options),
    }}
    >
      <ContextProvider value={{
        ...ctx,
        ...ctx_interface,
      }}
      >
        <div className="relative">
          {!valid_state && Msg(`Unknown load state: ${load_state}`)}
          {load_state === State.Error && Msg(`Error loading post data`)}
          {load_state === State.Loading && Msg(`Loading...`)}
          {load_state === State.Loaded && (
            <div className="mx-auto"
                 style={{
                   minHeight: `${block_picker === false ? '20' : '50'}rem`,
                   maxWidth:  '45rem',
                 }}
            >
              {can_add_blocks && (
                <div className="flex justify-center">
                  <AddBlockBtn index={0}
                               suggest_add_block={n_items === 0}
                               popup_direction={'down'} />
                </div>
              )}

              {n_items > 0 && (
                <DragDropContext onDragEnd={drag => reorder_items(drag)}>
                  <Droppable droppableId="d-blocks"
                             isDropDisabled={!can_add_blocks}
                             type="block"
                  >{prov => (
                    <div ref={prov.innerRef} {...prov.droppableProps}>
                      <AnimatePresence initial={false}>
                        {ctx.data.map((block_data, index) => (
                          <motion.div key={block_data.__uid}
                                      {...animations.item_add_and_remove}
                          >
                            <Block block_data={block_data}
                                   index={index}
                                   block_numbers={block_numbers} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {prov.placeholder}
                    </div>
                  )}</Droppable>
                </DragDropContext>
              )}
            </div>
          )}


          {picker_container_ref?.current && (
            ReactDOM.createPortal(
              <Modal isOpen={show_block_picker}
                     close={() => close_block_picker()}
              >
                <BlockPicker block_index={block_picker}
                             iframe_container_info={iframe_container_info}
                             set_block_to_insert={set_block_to_insert}
                             close={() => close_block_picker()} />
              </Modal>,
              picker_container_ref.current,
            )
          )}

          {!picker_container_ref && (
            <Modal isOpen={show_block_picker}
                   close={() => close_block_picker()}
            >
              <BlockPicker block_index={block_picker}
                           iframe_container_info={iframe_container_info}
                           set_block_to_insert={set_block_to_insert}
                           close={() => close_block_picker()} />
            </Modal>
          )}

        </div>
      </ContextProvider>
    </ThemeContext.Provider>
  )
}
