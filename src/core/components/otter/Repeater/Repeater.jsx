import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import {find_block_def, humanify_str} from '../../../definitions/utils'
import {usePageData} from '../../../contexts/PageDataContext'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'
import AddItemPillBtn from '../other/AddItemPillBtn'
import PopupMenuAnimated from '../PopupMenu'
import RepeaterItem from './RepeaterItem'
import animations from '../../../definitions/animations'
import {AnimatePresence, motion} from 'framer-motion'
import {useThemeContext} from '../../../contexts/ThemeContext'
import OErrorMessage from '../../default-ui/OErrorMessage'

function get_block_type(str_or_obj) {
  return typeof str_or_obj === 'string' ? str_or_obj : str_or_obj.type
}

const AddBtn = ({theme_ctx, set_show_popover, cb__add}) => (
  <AddItemPillBtn onClick={() => {
    cb__add({
      show_popup_func: () => set_show_popover(true),
      cb__block_added: () => set_show_popover(false),
    })
  }}
                  classNameBg={theme_ctx.classes.skin.add_repeater_item_btn.bg}
                  size="md" />
)

function prep_nested_block_defs(nested_block_defs, block_defs) {
  return nested_block_defs.map(block_def => (
    typeof block_def === 'string' ? find_block_def(block_defs, block_def) : block_def
  ))
}

export default function Repeater({field_def, field_name, parent_block_data}) {
  const ctx                              = usePageData()
  const theme_ctx                        = useThemeContext()
  const [show_popover, set_show_popover] = useState(false)
  const block_data                       = parent_block_data[field_name] || []
  const block_titles                     = field_def.block_titles !== false && true
  const nested_block_defs                = prep_nested_block_defs(field_def.nested_blocks || [], ctx.block_defs)
  const max                              = field_def.max || -1
  const multiple_types                   = nested_block_defs.length !== 1
  const dnd_context_id                   = `d-${parent_block_data.__uid}-${field_name}`
  const show_add_button                  = max === -1 || block_data.length < max
  const item_headers                     = field_def.item_headers
  const add_label                        = field_def.add_item_label || 'Add an item'

  function cb__add({
    show_popup_func,
    index,
    block_type,
    cb__block_added,
  }) {
    if (show_popup_func && nested_block_defs.length !== 1) {
      show_popup_func()
      return
    }

    block_type = block_type || get_block_type(nested_block_defs[0])

    if (!parent_block_data[field_name]) {
      parent_block_data[field_name] = []
    }

    if (!index && index !== 0) {
      parent_block_data[field_name].push({__type: block_type})
    }
    else {
      parent_block_data[field_name].splice(index, 0, {__type: block_type})
    }

    cb__block_added?.()

    ctx.value_updated()
    ctx.redraw()
    ctx.update_height()
  }

  function cb__delete(i) {
    const block_data = parent_block_data[field_name]
    block_data.splice(i, 1)

    ctx.value_updated()
    ctx.redraw()
    ctx.update_height()
  }

  function cb__reorder(drag_result) {
    if (!drag_result.destination || !drag_result.source) {
      return
    }
    if (drag_result.source.index === drag_result.destination.index) {
      return
    }

    const block_data = parent_block_data[field_name]
    const [item] = block_data.splice(drag_result.source.index, 1)
    block_data.splice(drag_result.destination.index, 0, item)

    ctx.value_updated()
    ctx.redraw()
    ctx.update_height()
  }

  const invalid_block_defs = nested_block_defs.reduce((carry, block, index) => {
    const is_valid = block && typeof block === 'object' && block.type
    return is_valid ? carry : carry.concat(index)
  }, [])

  if (invalid_block_defs.length > 0) {
    const multiple = invalid_block_defs.length > 1
    return (
      <p className="repeater-error">{`
        Error: the value${multiple ? 's' : ''} of nested_blocks at
        index${multiple ? 'es' : ''}
        ${invalid_block_defs.join(',')}
        ${multiple ? 'were' : 'was'} invalid
      `}</p>
    )
  }

  const nested_block_types = nested_block_defs.map(item => item.type)
  const popup_items = nested_block_defs.map(block_def => {
    return ({
      key:        block_def.type,
      block_type: block_def.type,
      label:      block_def.description || humanify_str(block_def.type),
    })
  })

  return (
    <div className="w-full">
      <div className="-mt-4"> {/* Negative margin to offset repeater item padding-top */}
        <DnD.DragDropContext onDragEnd={cb__reorder}>
          <DnD.Droppable droppableId={dnd_context_id} type={dnd_context_id}>
            {prov => (
              <div ref={prov.innerRef} {...prov.droppableProps}>
                <AnimatePresence initial={false}>
                  {block_data.map((block_data, index) => {
                    const is_permitted = nested_block_types.includes(block_data.__type)
                    const block_def = nested_block_defs.find(t => t.type === block_data.__type)

                    return (
                      <motion.div key={block_data.__uid || index}
                                  {...animations.item_add_and_remove}
                                  className="w-full relative"
                      >
                        <RepeaterItem index={index}
                                      popup_items={popup_items}
                                      dnd_context_id={dnd_context_id}
                                      dnd_key={block_data.__uid}
                                      cb__add={cb__add}
                                      cb__delete={cb__delete}
                                      with_collapsible_header_bar={item_headers}
                                      block_def={block_def}
                                      parent_block_data={parent_block_data}
                                      field_def={field_def}
                                      field_name={field_name}
                                      block_data={block_data}
                                      title={block_titles && (
                                        block_def.description || humanify_str(block_def.type)
                                      )}
                        >
                          {is_permitted ?
                            <RecursiveBlockRenderer block_data={block_data} /> :
                            <OErrorMessage text={`Items of type ${block_data.__type} are not allowed in this repeater`} />
                      }
                        </RepeaterItem>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {prov.placeholder}
              </div>
            )}
          </DnD.Droppable>
        </DnD.DragDropContext>

        {show_add_button && (
          <div className="relative text-center w-full">

            <div className="mt-3 -mb-[2px] space-y-1">
              {block_data.length < 1 && (
                <p className={theme_ctx.classes.typography.sub_heading}>{add_label}</p>
              )}
              <AddBtn {...{theme_ctx, set_show_popover, cb__add}} />
            </div>

            <div className="relative">
              <PopupMenuAnimated isOpen={show_popover && multiple_types}
                                 close={() => set_show_popover(false)}
                                 className="absolute-center-x bottom-4"
                                 items={popup_items.map(popup_item => (
                                   {
                                     ...popup_item,
                                     onClick: () => cb__add({
                                       block_type:      popup_item.block_type,
                                       cb__block_added: () => set_show_popover(false),
                                     }),
                                   }
                                 ))} />

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
