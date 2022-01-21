import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import {find_block, humanify_str} from '../../../definitions/utils'
import {usePageData} from '../../../contexts/PageDataContext'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'
import AddItemPillBtn from '../other/AddItemPillBtn'
import PopupMenuAnimated from '../PopupMenu'
import RepeaterItem from './RepeaterItem'
import animations from '../../../definitions/animations'
import {classNames} from '../../../helpers/style'
import {AnimatePresence, motion} from 'framer-motion'
import {useThemeContext} from '../../../contexts/ThemeContext'
import OErrorMessage from '../../default-ui/OErrorMessage'

function get_block_type(str_or_obj) {
  return typeof str_or_obj === 'string' ? str_or_obj : str_or_obj.type
}

export default function Repeater({field_def, containing_data_item}) {
  const ctx                          = usePageData()
  const theme_ctx                    = useThemeContext()
  const [show_picker_popup, set_show_picker_popup] = useState(false)
  const data_items                   = containing_data_item[field_def.name] || []
  const block_titles                 = field_def.block_titles !== false && true
  const nested_block_types           = field_def.nested_block_types || []
  const max                          = field_def.max || -1
  const multiple_types               = nested_block_types.length !== 1
  const dnd_context_id               = `d-${containing_data_item.__uid}-${field_def.name}`
  const show_add_button              = max === -1 || data_items.length < max

  function cb__add({
    show_popup_func,
    index,
    block_type,
    cb__block_added,
  }) {
    if (show_popup_func && nested_block_types.length !== 1) {
      show_popup_func()
      return
    }

    block_type = block_type || get_block_type(field_def.nested_block_types[0])

    if (!containing_data_item[field_def.name]) {
      containing_data_item[field_def.name] = []
    }

    if (!index && index !== 0) {
      containing_data_item[field_def.name].push({__type: block_type})
    }
    else {
      containing_data_item[field_def.name].splice(index, 0, {__type: block_type})
    }

    cb__block_added && cb__block_added()

    ctx.value_updated()
    ctx.redraw()
    ctx.update_height()
  }

  function cb__delete(i) {
    const data_items = containing_data_item[field_def.name]
    data_items.splice(i, 1)

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

    const data_items = containing_data_item[field_def.name]
    const [item] = data_items.splice(drag_result.source.index, 1)
    data_items.splice(drag_result.destination.index, 0, item)

    ctx.value_updated()
    ctx.redraw()
    ctx.update_height()
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
  const popup_items = blocktypes__objects.map(block => {
    return ({
      key:        block.type,
      block_type: block.type,
      label:      block.description || humanify_str(block.type),
    })
  })

  const no_items = data_items.length < 1

  return (
    <div className="w-full -mt-4">

      <DnD.DragDropContext onDragEnd={cb__reorder}>
        <DnD.Droppable droppableId={dnd_context_id} type={dnd_context_id}>
          {prov => (
            <div ref={prov.innerRef} {...prov.droppableProps}>
              <AnimatePresence initial={false}>
                {data_items.map((data_item, index) => {
                  const is_permitted = blocktypes__strings.includes(data_item.__type)
                  const block = blocktypes__objects.find(t => t.type === data_item.__type)

                  return (
                    <motion.div key={data_item.__uid || index}
                                {...animations.item_add_and_remove}
                                className="w-full"
                    >
                      <RepeaterItem index={index}
                                    popup_items={popup_items}
                                    dnd_context_id={dnd_context_id}
                                    dnd_key={data_item.__uid}
                                    title={block_titles && (block.description || humanify_str(block.type))}
                                    cb__add={cb__add}
                                    cb__delete={cb__delete}
                      >
                        {is_permitted ?
                          <RecursiveBlockRenderer data_item={data_item} blocks={ctx.blocks} /> :
                          <OErrorMessage text={`Items of type ${data_item.__type} are not allowed in this repeater`} />
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
        <div className={classNames(
          'relative text-center w-full',
          !no_items && !show_picker_popup && 'opacity-0 hover:opacity-100 transition-opacity',
        )}
             style={{paddingTop: !no_items && '2px'}}
        >

          {no_items && (
            <h5 className={classNames(
              theme_ctx.classes.typography.sub_heading,
              'pt-4',
              'mb-1',
            )}
            >Add an item</h5>
          )}

          <AddItemPillBtn onClick={() => {
            cb__add({
              show_popup_func: () => set_show_picker_popup(true),
              cb__block_added: () => set_show_picker_popup(false),
            })
          }}
                          className={classNames(
                            no_items && 'mb-2',
                            'inline-flex',
                          )}
                          classNameBg={theme_ctx.classes.skin.add_repeater_item_btn.bg}
                          size="md" />


          <div className="relative">
            <PopupMenuAnimated isOpen={show_picker_popup && multiple_types}
                               close={() => set_show_picker_popup(false)}
                               className="absolute-center-x bottom-4"
                               items={popup_items.map(popup_item => (
                                 {
                                   ...popup_item,
                                   onClick: () => cb__add({
                                     block_type:      popup_item.block_type,
                                     cb__block_added: () => set_show_picker_popup(false),
                                   }),
                                 }
                               ))} />

          </div>

        </div>
      )}
    </div>
  )
}
