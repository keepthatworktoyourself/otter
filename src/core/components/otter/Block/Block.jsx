import React, {useState} from 'react'
import * as DnD from 'react-beautiful-dnd'
import PlusSolid from 'simple-react-heroicons/icons/PlusSolid'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'
import BlockHeader from './BlockHeader'
import BlockSection from './BlockSection'
import AddBlockBtn from './AddBlockBtn'
import BlockDeleteConfirmPopoverAnimated from './BlockDeleteConfirmPopover'
import CollapseTransition from '../../primitives/CollapseTransition'
import {TabsProvider, TabsTab} from '../../primitives/Tabs'
import {usePageData} from '../../../contexts/PageDataContext'
import {find_block, humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'

const drag_styles = { }

function get_drag_styles(provided, snapshot) {
  const custom_styles = snapshot.isDragging ? drag_styles : { }
  return {
    ...custom_styles,
    ...provided.draggableProps.style,
  }
}

export default function Block({data_item, index, block_numbers}) {
  const ctx               = usePageData()
  const theme_ctx         = useThemeContext()
  const blocks            = ctx.blocks
  const draggable_key     = `block-${data_item.__uid}`
  const block             = find_block(blocks, data_item.__type)
  const tabs              = block?.tabs && block?.tabs?.length > 0 && block.tabs
  const tab_btns          = tabs && tabs.map(tab => tab?.Icon || PlusSolid)

  const [open, set_open]                                   = useState(true)
  const [show_confirm_deletion, set_show_confirm_deletion] = useState(false)

  return (
    <TabsProvider>
      <DnD.Draggable key={draggable_key}
                     draggableId={draggable_key}
                     index={index}
                     type="block"
                     isDragDisabled={!ctx.can_add_blocks}
      >
        {(prov, snap) => (
          <div ref={prov.innerRef}
               {...prov.draggableProps}
               {...prov.dragHandleProps}
               className="outline-none"
               style={get_drag_styles(prov, snap)}
          >
            <div className={classNames('relative', !ctx.can_add_blocks && 'pb-8')}
                 data-blocktype={data_item.__type}
            >

              <div className={classNames(
                theme_ctx.classes.skin.block.bg,
                !theme_ctx.design_options.floaty_blocks && 'border',
                !theme_ctx.design_options.floaty_blocks && theme_ctx.classes.skin.border_color,
              )}
                   style={{
                     boxShadow: theme_ctx.design_options.floaty_blocks &&
                      theme_ctx.design_options.block_shadow,
                     minWidth: theme_ctx.design_options.block_min_width,
                   }}
              >

                <BlockDeleteConfirmPopoverAnimated delete_func={() => ctx.delete_item(index)}
                                                   isOpen={show_confirm_deletion}
                                                   close={() => set_show_confirm_deletion(false)}
                                                   className={classNames(
                                                     'absolute right-4 top-4',
                                                     'z-10',
                                                   )}
                                                   transformOrigin="right" />

                <div className={classNames('relative', !open && 'overflow-hidden')}>

                  {block && (
                    <div className={
                      classNames(
                        'relative',
                      )}
                    >

                      <BlockHeader heading={block.description || humanify_str(block.type)}
                                   block_number={block_numbers && index + 1}
                                   show_confirm_deletion={show_confirm_deletion}
                                   reveal_show_confirm_deletion={ctx.can_add_blocks ? () => set_show_confirm_deletion(true) : null}
                                   open={open}
                                   tab_btn_icons={tab_btns}
                                   toggle_open={() => {
                                     ctx.update_height()
                                     set_open(!open)
                                   }} />

                      <div style={{position: 'relative'}}>
                        <CollapseTransition collapsed={!open}
                                            className="text-xs relative"
                                            initialOverflowValue="visible"
                        >
                          {!tabs && (
                            <BlockSection>
                              <RecursiveBlockRenderer data_item={data_item} blocks={blocks} />
                            </BlockSection>
                          )}

                          {tabs && tabs.map((tab, i) => {
                            const block_fields = find_block(blocks, data_item.__type).fields
                            const tab_fields = block_fields.filter(field => tab.fields.includes(field.name))

                            return (
                              <TabsTab key={`tab--${i}`} index={i}>
                                <BlockSection>
                                  <RecursiveBlockRenderer data_item={data_item}
                                                          block_fields={tab_fields}
                                                          blocks={blocks} />
                                </BlockSection>
                              </TabsTab>
                            )
                          })}

                        </CollapseTransition>
                      </div>
                    </div>
                  )}

                  {!block && (
                    <h3>{`Unknown block type: '${data_item.__type}'`}</h3>
                  )}

                </div>
              </div>

              {ctx.can_add_blocks && block && (
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

