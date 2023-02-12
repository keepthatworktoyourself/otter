import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import MinusCircleSolid from 'simple-react-heroicons/icons/MinusCircleSolid'
import {usePageData} from '../../../contexts/PageDataContext'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import {TabsProvider, TabsTab} from '../../primitives/Tabs'
import BlockDeleteConfirmPopoverAnimated from '../Block/BlockDeleteConfirmPopover'
import BlockAndRepeaterHeader from '../other/BlockAndRepeaterHeader'
import TabBtns from '../other/TabBtns'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'

const RepeaterItem__DeleteSideBar = ({theme_ctx, cb__delete, index, with_numbers}) => (
  <div className={classNames(
    'px-[0.5em] py-4 flex flex-col justify-center border-l',
    'rounded-l-none',
    theme_ctx.classes.skin.border_color,
    theme_ctx.classes.skin.repeater_item_header.bg,
    theme_ctx.classes.skin.repeater_item.border_radius,
  )}
  >
    <div className="flex flex-col justify-center items-center">
      {with_numbers && <span className={theme_ctx.classes.typography.input_label}>{index + 1}</span>}
      <div className={classNames(
        'svg-font text-lg cursor-pointer',
        theme_ctx.classes.skin.repeater_remove_item_btn,
      )}
           onClick={() => cb__delete(index)}
      >
        <MinusCircleSolid />
      </div>
    </div>
  </div>
)

const Inner = ({children, contains_nested_repeater, padding_disabled}) => (
  <div className={classNames(
    'relative',
    'flex flex-1 flex-wrap space-y-2',
    contains_nested_repeater ? 'px-4 pt-4 pb-2' : !padding_disabled && 'p-4',
  )}
  >
    {children}
  </div>
)

export default function RepeaterItem({
  index,
  cb__delete,
  dnd_key,
  dnd_context_id,
  title,
  popup_items,
  cb__add,
  children,
  contains_nested_repeater = false,
  with_collapsible_header_bar = false,
  with_numbers = true,
  field_name,
  block_def,
  parent_block_data,
  block_data,
  ...props
}) {
  const ctx              = usePageData()
  const theme_ctx        = useThemeContext()
  const draggable_key    = `draggable-repeater-item-${props.dnd_key || index}`
  const tabs             = block_def?.tabs || []
  const has_tabs         = tabs && tabs?.length > 0
  const icon_tab_btns    = has_tabs && with_collapsible_header_bar && tabs.every(t => !!t.Icon)

  const tab_btns = has_tabs && tabs.map(tab => {
    return icon_tab_btns ? tab.Icon : tab.label
  })

  const [open, set_open] = useState(true)
  const [show_confirm_deletion, set_show_confirm_deletion] = useState(false)

  const toggle_open = () => {
    ctx.update_height()
    set_open(!open)
  }

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
             className="pt-4"
        >
          <div className={classNames(
            'relative',
            !with_collapsible_header_bar && 'flex',
            'cursor-grab active:cursor-grabbing group',
            'group-direct-decendent-opacity-1-onHover',
            'group-first-of-type-opacity-1-onHover',
            theme_ctx.classes.skin.repeater_item.bg,
            theme_ctx.classes.skin.border_color,
            theme_ctx.classes.skin.repeater_item.border_radius,
            theme_ctx.classes.skin.repeater_item.shadow,
            'border',
          )}
          >
            <TabsProvider>
              {with_collapsible_header_bar && (
                <>
                  <BlockDeleteConfirmPopoverAnimated delete_func={() => cb__delete(index)}
                                                     isOpen={show_confirm_deletion}
                                                     close={() => set_show_confirm_deletion(false)}
                                                     className={classNames(
                                                       'absolute right-4 top-4',
                                                       'z-10',
                                                     )}
                                                     transformOrigin="right" />
                  <BlockAndRepeaterHeader heading={title}
                                          index={index}
                                          block_numbers={true}
                                          show_confirm_deletion={show_confirm_deletion}
                                          delete_func={() => set_show_confirm_deletion(true)}
                                          open={open}
                                          tab_btn_icons={icon_tab_btns && tab_btns}
                                          toggle_open={toggle_open}
                                          classNameBorderRadius={theme_ctx.classes.skin.repeater_item.border_radius}
                                          classNameBorder={theme_ctx.classes.skin.repeater_item_header.border}
                                          classNameBg={theme_ctx.classes.skin.repeater_item_header.bg}
                                          classNameYPad={theme_ctx.classes.skin.repeater_item_header.y_pad}
                                          classNameHeading={theme_ctx.classes.skin.repeater_item_header.heading}
                                          iconThemeClassNamesObj={theme_ctx.classes.skin.repeater_item_header_icon} />
                </>
              )}
              <CollapseTransition collapsed={!open}>

                {has_tabs && (
                <Inner {...{children, contains_nested_repeater}}>
                  <div className="w-full">
                    {!icon_tab_btns &&  <TabBtns tabs={tabs} />}

                    {tabs.map((tab, i) => {
                      const block_fields = block_def.fields
                      const tab_fields = block_fields.filter(field => tab.fields.includes(field.name))
                      return (
                        <TabsTab key={i} index={i}>
                          <Inner {...{children, contains_nested_repeater}} padding_disabled={true}>
                            <RecursiveBlockRenderer field_name={field_name}
                                                    block_data={block_data}
                                                    parent_block_data={parent_block_data}
                                                    block_fields={tab_fields} />
                          </Inner>
                        </TabsTab>
                      )
                    })}
                  </div>
                </Inner>
                )}

                {!has_tabs && <Inner {...{children, contains_nested_repeater}} />}
              </CollapseTransition>
            </TabsProvider>

            {!with_collapsible_header_bar && (
              <RepeaterItem__DeleteSideBar {...{
                theme_ctx,
                cb__delete,
                index,
                with_numbers,
              }} />
            )}

          </div>
        </div>
      )}
    </DnD.Draggable>
  )
}
