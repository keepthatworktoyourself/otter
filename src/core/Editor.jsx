import React, {useState, useReducer, useEffect, useMemo} from 'react'
import ReactDOM from 'react-dom'
import * as DnD from 'react-beautiful-dnd'
import {PageDataContext} from './PageDataContext'
import Block from './Block'
import AddBlockBtn from './other/AddBlockBtn'
import BlockPicker from './other/BlockPicker'
import fields from './fields/fields'
import {
  copy,
  evaluate,
  find_block,
  display_if,
  uid,
  iterate,
  iterate_data,
  blocks_are_grouped,
} from './definitions/utils'
import State from './definitions/state'
import Save from './definitions/save'
import styles from './definitions/styles'

function export_data_item(data_item, blocks) {
  if (!data_item) {
    return null
  }

  const block = find_block(blocks, data_item.__type)
  if (!block) {
    return null
  }

  const fields__displayed = (block.fields || []).filter(field_def => {
    const di = display_if(block, field_def.name, data_item)
    return di.display === true
  })

  return fields__displayed.reduce((carry, field_def) => {
    const field_name  = field_def.name
    const field_type  = field_def.type
    const field_value = data_item[field_name]

    if (field_type === fields.NestedBlock || field_type === fields.Repeater) {
      if (field_type === fields.Repeater) {
        carry[field_name] = (field_value || []).map(item => export_data_item(item, blocks))
      }
      else if (field_type === fields.NestedBlock) {
        carry[field_name] = export_data_item(field_value, blocks)
      }
      if (field_def.optional) {
        carry[field_name]['__enabled'] = !!field_value['__enabled']
      }
    }

    else {
      const use_default = field_value === null || field_value === undefined || field_value === ''
      carry[field_name] = use_default ?
        evaluate(field_def.default_value) :
        field_value
    }

    const val = carry[field_name]
    const remove = (
      val === '' ||
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
  }, {__type: block.type})
}

function ensure_uids(data) {
  iterate_data(data, data_item => {
    if (data_item && !data_item.__uid) {
      data_item.__uid = uid()
    }
  })
}

function ensure_display_ifs_are_arrays(blocks) {
  iterate(blocks, item => {
    if (item && item.display_if && item.display_if.constructor !== Array) {
      item.display_if = [item.display_if]
    }
  })
}

const Msg = msg => (
  <div className="otter-load-error p-4 bg-gray-50 text-center">
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
    const {type, index} = op.add_item
    const data_item = {__type: type}

    typeof index === 'number' ?
      state.data.splice(index, 0, data_item) :
      state.data.push(data_item)
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

  return {data: state.data, blocks: state.blocks}
}


// Editor
// -----------------------------------

export default function Editor({
  blocks = [],
  data = [],
  delegate,
  load_state,
  when_to_save = Save.OnClick,
  block_numbers = false,
  add_block_msg = null,
  can_add_blocks = true,
  DragDropContext = DnD.DragDropContext,
  Droppable = DnD.Droppable,
  ContextProvider = PageDataContext.Provider,
  BlockStub = Block,
  draw_block_picker_into,
  iframe_container_info = { },
}) {
  const valid_state = Object.values(State).includes(load_state)
  const [block_picker, set_block_picker] = useState(false)
  const [previous_load_state, set_previous_load_state] = useState(null)
  const [_, update] = useState({ })
  const initial_data = useMemo(() => copy(data), [])
  const [ctx, dispatch_ctx] = useReducer(ctx_reducer, {data: initial_data, blocks})

  function enqueue_save_on_input() {
    setTimeout(do_save_on_input)
  }
  function add_item(type, index) {
    dispatch_ctx({add_item: {type, index}})
    enqueue_save_on_input()
    block_toggled()
  }
  function delete_item(index) {
    dispatch_ctx({delete_item: {index}})
    enqueue_save_on_input()
    block_toggled()
  }
  function reorder_items(drag_result) {
    dispatch_ctx({reorder: drag_result})
    enqueue_save_on_input()
  }
  function redraw() {
    update({ })
  }
  function block_toggled() {
    delegate?.block_toggled?.()
  }
  function open_block_picker(block_index) {
    set_block_picker_state(block_index)
  }
  function close_block_picker() {
    set_block_picker(false)
  }

  useEffect(() => dispatch_ctx({set_data: data}), [data])

  const ctx_interface = {
    block_toggled,
    redraw,
    value_updated: enqueue_save_on_input,
    add_item,
    delete_item,
    open_block_picker,
    close_block_picker,
    can_add_blocks,
  }

  function get_data() {
    return (ctx.data || []).map(item => export_data_item(item, ctx.blocks))
  }

  function set_block_picker_state(open) {
    set_block_picker(open)
    window.scrollY,
    block_toggled()
  }

  function do_save_on_input() {
    when_to_save === Save.OnInput && do_save()
  }

  function do_save() {
    delegate && delegate.save && delegate.save(get_data())
  }

  ensure_uids(ctx.data)
  ensure_display_ifs_are_arrays(ctx.blocks)

  if (load_state === State.Loaded && previous_load_state !== State.Loaded) {
    block_toggled()
  }
  if (load_state !== previous_load_state) {
    set_previous_load_state(load_state)
  }

  const show_block_picker = (
    can_add_blocks &&
    load_state === State.Loaded &&
    block_picker !== false &&
    blocks_are_grouped(ctx.blocks)
  )

  const n_items = ctx.data?.length || 0

  return (
    <ContextProvider value={{...ctx, ...ctx_interface}}>
      <div className="post-builder relative p-4 md:p-8 bg-gray-600"
           style={{stroke: styles.text_color}}
      >
        {!valid_state && Msg(`Unknown load state: ${load_state}`)}
        {load_state === State.Error && Msg(`Error loading post data`)}
        {load_state === State.Loading && Msg(`Loading...`)}
        {load_state === State.Loaded && (
          <div className="post-builder-inner text-gray-800 text-xs mx-auto"
               style={{
                 minHeight: `${block_picker === false ? '20' : '50'}rem`,
                 maxWidth:  '50rem',
               }}
          >
            {when_to_save === Save.OnClick && (
              <div className="save-button m-4">
                <a className="button" onClick={do_save}>Save</a>
              </div>
            )}

            <DragDropContext onDragEnd={drag => reorder_items(drag)}>
              <Droppable droppableId="d-blocks" isDropDisabled={!can_add_blocks} type="block">{(prov, snap) => (
                <div ref={prov.innerRef} {...prov.droppableProps}>
                  {(ctx.data || []).map((data_item, index) =>
                    <BlockStub key={data_item.__uid}
                               data_item={data_item}
                               index={index}
                               block_numbers={block_numbers} />,
                  )}

                  {prov.placeholder}
                </div>
              )}</Droppable>
            </DragDropContext>

            {can_add_blocks && (
              <div className="flex justify-center">
                <AddBlockBtn index={n_items}
                             suggest={n_items === 0}
                             msg={add_block_msg}
                             popup_direction={n_items ? 'up' : 'down'} />
              </div>
            )}
          </div>
        )}

        {show_block_picker && (
          draw_block_picker_into ?
            ReactDOM.createPortal(
              <BlockPicker block_index={block_picker}
                           iframe_container_info={iframe_container_info}
                           draw_block_picker_into={draw_block_picker_into} />,
              draw_block_picker_into.current,
            ) :
            <BlockPicker block_index={block_picker}
                         iframe_container_info={iframe_container_info} />
        )}
      </div>
    </ContextProvider>
  )
}
