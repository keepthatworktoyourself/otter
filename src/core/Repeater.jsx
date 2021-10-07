import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import {usePageData} from './PageDataContext'
import {find_block, humanify_str} from './definitions/utils'
import RepeaterItem from './RepeaterItem'
import RecursiveBlockRenderer from './RecursiveBlockRenderer'
import ErrorField from './fields/ErrorField'
import styles from './definitions/styles'

function get_block_type(str_or_obj) {
  return typeof str_or_obj === 'string' ? str_or_obj : str_or_obj.type
}

export default function Repeater(props) {
  const ctx                        = usePageData()
  const [dialogue, set_dialogue]   = useState(false)
  const field_def                  = props.field_def
  const containing_data_item       = props.containing_data_item
  const DragDropContext            = props.drag_context_component  || DnD.DragDropContext
  const Droppable                  = props.droppable_component     || DnD.Droppable
  const RepeaterItemStub           = props.repeater_item_component || RepeaterItem
  const RecursiveBlockRendererStub = props.rbr_component           || RecursiveBlockRenderer
  const data_items                 = containing_data_item[field_def.name] || []
  const nested_block_types         = field_def.nested_block_types || []
  const max                        = field_def.max || -1
  const multiple_types             = nested_block_types.length !== 1
  const dnd_context_id             = `d-${containing_data_item.__uid}-${field_def.name}`
  const show_add_button            = max === -1 || data_items.length < max

  function cb__add_btn() {
    if (nested_block_types.length > 1) {
      set_dialogue(!dialogue)
    }
    else if (nested_block_types.length === 1) {
      cb__add()
    }
  }

  function cb__add(ev) {
    const block_type = ev ?
      ev.currentTarget.getAttribute('data-nested_block-type') :
      get_block_type(props.field_def.nested_block_types[0])

    if (!containing_data_item[field_def.name]) {
      containing_data_item[field_def.name] = []
    }
    containing_data_item[field_def.name].push({__type: block_type})

    set_dialogue(false)
    ctx.value_updated()
    ctx.redraw()
    ctx.block_toggled()
  }

  function cb__delete(i) {
    const data_items = containing_data_item[field_def.name]
    data_items.splice(i, 1)

    ctx.value_updated()
    ctx.redraw()
    ctx.block_toggled()
  }

  function cb__reorder(drag_result) {
    if (!drag_result.destination || !drag_result.source) {
      return
    }
    if (drag_result.source.index === drag_result.destination.index) {
      return
    }

    const data_items = containing_data_item[field_def.name]
    const [item] = data_items.splice(drag_result.source.index, 1)
    data_items.splice(drag_result.destination.index, 0, item)

    ctx.value_updated()
    ctx.redraw()
    ctx.block_toggled()
  }

  const blocktypes__objects = nested_block_types.map(t => (
    typeof t === 'string' ? find_block(ctx.blocks, t) : t
  ))

  const invalid_blocktypes = blocktypes__objects.reduce((carry, block, index) => {
    const is_valid = block && typeof block === 'object' && block.type
    return is_valid ? carry : carry.concat(index)
  }, [])
  if (invalid_blocktypes.length > 0) {
    const multiple = invalid_blocktypes.length > 1
    return (
      <p className="repeater-error">{`
        Error: the value${multiple ? 's' : ''} of nested_block_types at
        index${multiple ? 'es' : ''}
        ${invalid_blocktypes.join(',')}
        ${multiple ? 'were' : 'was'} invalid
      `}</p>
    )
  }

  const blocktypes__strings = blocktypes__objects.map(item => item.type)

  return (
    <>
      <DragDropContext onDragEnd={cb__reorder}>
        <Droppable droppableId={dnd_context_id} type={dnd_context_id}>{(prov, snap) => (
          <div ref={prov.innerRef} {...prov.droppableProps}>

            {data_items.map((data_item, index) => {
              const is_permitted = blocktypes__strings.includes(data_item.__type)

              return (
                <RepeaterItemStub index={index}
                                  dnd_context_id={dnd_context_id}
                                  dnd_key={data_item.__uid}
                                  key={data_item.__uid || index}
                                  cb__delete={cb__delete}
                >

                  {is_permitted ?
                    <RecursiveBlockRendererStub data_item={data_item} blocks={ctx.blocks} /> :
                    <ErrorField text={`Items of type ${data_item.__type} are not allowed in this repeater`} />
                  }

                </RepeaterItemStub>
              )
            })}

            {prov.placeholder}

          </div>
        )}</Droppable>
      </DragDropContext>

      {show_add_button && (
        <div className="repeater-add-btn mb-4">
          <div className="relative">

            <div className="">
              <button onClick={cb__add_btn}
                      className={
                        `${styles.button} ${styles.button_pad} ` +
                        `${styles.control_border} ${styles.control_border__interactive}`
                      }
              >
                <span>Add item</span>
              </button>
            </div>

            {multiple_types && dialogue && (
              <div style={{minWidth: '10rem'}}
                   className={
                     `repeater-add-menu absolute rounded-lg mt-1 z-1 ` +
                     `${styles.control_border} overflow-hidden`
                   }
              >
                {blocktypes__objects.map((block, i) => (
                  <a onClick={cb__add} key={i} data-nested_block-type={block.type}
                     className={`
                       repeater-add-menu-item
                       block p-2
                       cursor-pointer
                       ${styles.control_bg} hover:bg-gray-100 active:bg-gray-200
                       ${i < blocktypes__objects.length - 1 ? 'border-b' : ''}
                     `}
                  >
                    {block.description || humanify_str(block.type)}
                  </a>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}

