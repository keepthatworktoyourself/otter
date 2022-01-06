import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import ChevronDownSolid from 'simple-react-heroicons/icons/ChevronDownSolid'
import MinusCircleSolid from 'simple-react-heroicons/icons/MinusCircleSolid'
import {usePageData} from '../../../contexts/PageDataContext'
import {useThemeContext} from '../../../contexts/ThemeContext'
import design_options from '../../../definitions/design-options'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import AddItemPillBtn from '../other/AddItemPillBtn'
import PopupMenuAnimated from '../PopupMenu'

export default function RepeaterItem({
  index,
  cb__delete,
  dnd_key,
  dnd_context_id,
  title,
  with_item_padding = true,
  contains_nested_repeater = false,
  children,
  with_numbers = false,
  popup_items,
  cb__add,
  ...props
}) {
  const ctx       = usePageData()
  const theme_ctx = useThemeContext()
  const draggable_key    = `draggable-repeater-item-${props.dnd_key || index}`
  const [open, set_open] = useState(true)
  const [show_picker_popup, set_show_picker_popup] = useState(false)

  return (
    <DnD.Draggable key={draggable_key}
                   draggableId={draggable_key}
                   type={dnd_context_id}
                   index={index}
    >
      {prov => (
        <div ref={prov.innerRef}
             {...prov.draggableProps}
             {...prov.dragHandleProps}
        >
          <div className={classNames(
            'text-center opacity-0',
            !show_picker_popup ? 'hover:opacity-100 transition-opacity' : 'opacity-100',
          )}
               style={{padding: '2px 0'}}
          >

            <AddItemPillBtn className="inline-flex"
                            classNameBg={theme_ctx.classes.skin.add_repeater_item_btn.bg}
                            size="md"
                            onClick={() => {
                              cb__add({
                                index:           index,
                                show_popup_func: () => set_show_picker_popup(true),
                                cb__block_added: () => set_show_picker_popup(false),
                              })
                            }} />


            <div className="relative">
              <PopupMenuAnimated isOpen={show_picker_popup}
                                 close={() => set_show_picker_popup(false)}
                                 className={classNames(
                                   'absolute-center-x',
                                   index === 0 ? 'top-2' : 'bottom-7',
                                 )}
                                 items={popup_items.map(popup_item => ({
                                   ...popup_item,
                                   onClick: () => cb__add({
                                     block_type:      popup_item.block_type,
                                     index:           index,
                                     cb__block_added: () => set_show_picker_popup(false),
                                   }),
                                 }))} />

            </div>

          </div>

          <div className={classNames(
            'border-t border-r border-l',
            open && 'border-b',
            'relative overflow-hidden',
            'cursor-grab active:cursor-grabbing',
            'group-direct-decendent-opacity-1-onHover',
            'group-first-of-type-opacity-1-onHover',
            'group',
            theme_ctx.classes.skin.border_color,
            theme_ctx.classes.skin.repeater_item.bg,
          )}
          >
            <div className={classNames(
              'tracking-tighter',
              'relative flex items-center',
              'border-b pl-4 pr-3 justify-between',
              'group',
              theme_ctx.classes.skin.repeater_item.header_bg,
              theme_ctx.classes.skin.border_color,
              theme_ctx.classes.typography.heading,
            )}
            >
              <div className={classNames(
                'flex items-center cursor-pointer',
              )}
                   onClick={() => {
                     set_open(!open)
                     ctx.update_height()
                   }}
              >
                <h1 style={{padding: '0.85em 0'}} className="flex items-center leading-none">
                  {with_numbers && <span className="w-4">{index + 1}</span>}
                  <span>{title}</span>
                </h1>
                <span className={classNames(
                  'svg-font fill-current',
                  'transform transition-transform',
                  'p-1',
                  open && 'rotate-180',
                )}
                >
                  <ChevronDownSolid />
                </span>
              </div>
              <div className={classNames(
                'svg-font',
                'text-lg cursor-pointer',
                theme_ctx.classes.skin.repeater_remove_item_btn,
              )}
                   onClick={() => cb__delete(index)}
              >
                <MinusCircleSolid />
              </div>
            </div>

            <CollapseTransition collapsed={!open}>
              <div className={classNames(
                'relative flex-1',
                with_item_padding && !contains_nested_repeater && 'p-4',
                with_item_padding &&
                  contains_nested_repeater &&
                  'px-4 pt-4 pb-2',
                'space-y-2',
              )}
              >
                {children}
              </div>
            </CollapseTransition>

          </div>
        </div>
      )}
    </DnD.Draggable>
  )
}
