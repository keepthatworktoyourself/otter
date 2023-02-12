import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'
import BlockAndRepeaterHeader from '../other/BlockAndRepeaterHeader'
import BlockSection from './BlockSection'
import AddBlockBtn from './AddBlockBtn'
import BlockDeleteConfirmPopoverAnimated from './BlockDeleteConfirmPopover'
import CollapseTransition from '../../primitives/CollapseTransition'
import {TabsProvider, TabsTab} from '../../primitives/Tabs'
import {usePageData} from '../../../contexts/PageDataContext'
import {find_block_def, humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'
import TabBtns from '../other/TabBtns'

const drag_styles = { }

function get_drag_styles(provided, snapshot) {
  const custom_styles = snapshot.isDragging ? drag_styles : { }
  return {
    ...custom_styles,
    ...provided.draggableProps.style,
  }
}

export default function Block({block_data, index, block_numbers}) {
  const ctx               = usePageData()
  const theme_ctx         = useThemeContext()
  const draggable_key     = `block-${block_data.__uid}`
  const block             = find_block_def(ctx.block_defs, block_data.__type)
  const tabs              = block?.tabs && block?.tabs?.length > 0 && block.tabs
  const icon_tab_btns     = tabs && tabs.every(t => !!t.Icon)
  const seamless          = !!block?.seamless

  const tab_btns = tabs && tabs.map(tab => {
    return icon_tab_btns ? tab.Icon : tab.label
  })

  const [open, set_open]                                   = useState(true)
  const [show_confirm_deletion, set_show_confirm_deletion] = useState(false)

  return (
    <TabsProvider>
      <DnD.Draggable key={draggable_key}
                     draggableId={draggable_key}
                     index={index}
                     type="block"
                     isDragDisabled={!ctx.can_add_and_remove_blocks}
      >
        {(prov, snap) => (
          <div ref={prov.innerRef}
               {...prov.draggableProps}
               {...prov.dragHandleProps}
               className="outline-none"
               style={get_drag_styles(prov, snap)}
          >
            <div className={classNames('relative', !ctx.can_add_and_remove_blocks && 'pb-8')}
                 data-blocktype={block_data.__type}
            >

              <div style={{minWidth: theme_ctx.design_options.block_min_width}}
                   className={classNames(
                     theme_ctx.classes.skin.block.bg,
                     theme_ctx.classes.skin.block.border_radius,
                     theme_ctx.classes.skin.border_color,
                     !seamless && theme_ctx.classes.skin.block.border,
                     !seamless && theme_ctx.classes.skin.block.shadow,
                   )}
              >
                {ctx.can_add_and_remove_blocks && (
                  <BlockDeleteConfirmPopoverAnimated delete_func={() => ctx.delete_item(index)}
                                                     isOpen={show_confirm_deletion}
                                                     close={() => set_show_confirm_deletion(false)}
                                                     className={classNames(
                                                       'absolute right-4 top-4',
                                                       'z-10',
                                                     )}
                                                     transformOrigin="right" />
                )}

                <div className={classNames('relative', !open && 'overflow-hidden')}>
                  {block && (
                    <div className="relative">
                      {!seamless && (
                        <BlockAndRepeaterHeader heading={block.description || humanify_str(block.type)}
                                                index={index}
                                                block_numbers={block_numbers}
                                                show_confirm_deletion={show_confirm_deletion}
                                                delete_func={ctx.can_add_and_remove_blocks ? () => set_show_confirm_deletion(true) : null}
                                                open={open}
                                                tab_btn_icons={icon_tab_btns && tab_btns}
                                                toggle_open={() => {
                                                  ctx.update_height()
                                                  set_open(!open)
                                                }}
                                                classNameBorderRadius={theme_ctx.classes.skin.block.border_radius}
                                                classNameBorder={theme_ctx.classes.skin.block_header.border}
                                                classNameBg={theme_ctx.classes.skin.block_header.bg}
                                                classNameYPad={theme_ctx.classes.skin.block_header.y_pad}
                                                classNameHeading={theme_ctx.classes.skin.block_header.heading}
                                                iconThemeClassNamesObj={theme_ctx.classes.skin.block_header_icon} />
                      )}

                      <div className="relative text-xs">
                        <CollapseTransition collapsed={!open}
                                            className="relative"
                        >
                          {!tabs && (
                            <BlockSection bordered={false} seamless={seamless}>
                              <RecursiveBlockRenderer block_data={block_data} />
                            </BlockSection>
                          )}

                          {tabs && !icon_tab_btns && (
                            <TabBtns tabs={tabs} className="pt-4 px-4 pb-1" />
                          )}

                          {tabs && tabs.map((tab, i) => {
                            const block_fields = find_block_def(ctx.block_defs, block_data.__type).fields
                            const tab_fields = block_fields.filter(field => tab.fields.includes(field.name))

                            return (
                              <TabsTab key={`tab--${i}`} index={i}>
                                <BlockSection bordered={false}
                                              seamless={seamless}
                                >
                                  <RecursiveBlockRenderer block_data={block_data}
                                                          block_fields={tab_fields} />
                                </BlockSection>
                              </TabsTab>
                            )
                          })}

                        </CollapseTransition>
                      </div>
                    </div>
                  )}

                  {!block && (
                    <h3>{`Unknown block type: '${block_data.__type}'`}</h3>
                  )}

                </div>
              </div>

              {ctx.can_add_and_remove_blocks && block && (
                <AddBlockBtn index={index + 1}
                             popup_direction={index > 1 ? 'up' : 'down'} />
              )}

            </div>
          </div>
        )}
      </DnD.Draggable>
    </TabsProvider>
  )
}
