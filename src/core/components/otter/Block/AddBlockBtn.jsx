import React, {useState} from 'react'
import AddItemPillBtn from '../other/AddItemPillBtn'
import design_options from '../../../definitions/design-options'
import {blocks_are_simple, humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {usePageData} from '../../../contexts/PageDataContext'
import PopupMenuAnimated from '../PopupMenu'

import {useThemeContext} from '../../../contexts/ThemeContext'

const hover_effect_on = false

export default function AddBlockBtn({
  popup_direction = 'up',
  index,
  suggest_add_block,
}) {
  const ctx                    = usePageData()
  const theme_ctx              = useThemeContext()
  const blocks                 = ctx?.blocks || []
  const [is_open, set_is_open] = useState(false)
  const is_flat                = blocks_are_simple(blocks)
  const displayed_blocks = is_flat && blocks.filter(item => item && item.hidden !== true)
  const popup_items      = is_flat && displayed_blocks.map((block, i) => ({
    label:   block.description || humanify_str(block.type),
    onClick: () => cb__select(i),
  }))

  function cb__toggle() {
    if (is_flat) {
      set_is_open(!is_open)
    }
    else {
      ctx.open_block_picker(index)
    }
  }

  function cb__select(i) {
    set_is_open(false)
    ctx.add_item(displayed_blocks[i].type, index)
  }

  const Btn = () => (
    <div className={classNames(
      'relative transition-all',
      'group-hover:opacity-100',
      !is_open && !suggest_add_block && 'opacity-0',
      hover_effect_on && 'group-hover:py-3 py-0',
      hover_effect_on && is_open && 'py-3',
      !hover_effect_on && 'py-1',
    )}
         style={hover_effect_on ? {transitionDelay: '0.075s'} : {}}
    >
      <AddItemPillBtn className="absolute-center"
                      onClick={cb__toggle}
                      style={design_options.floaty_blocks && {boxShadow: design_options.block_shadow}} />
    </div>
  )

  return (
    <div className={classNames(
      'z-10 group text-xs',
      suggest_add_block && classNames(
        'border border-dashed w-full text-center mt-6',
        'pt-4 pb-7',
        theme_ctx.classes.skin.border_color,
        theme_ctx.classes.skin.block.bg,
      ),
      !suggest_add_block && 'py-4',
    )}
    >
      {suggest_add_block && (
        <h5 className={classNames(
          theme_ctx.classes.typography.sub_heading,
          'mb-3',
        )}
        >Add a block</h5>
      )}

      <Btn />

      {is_flat && (
        <div className="relative z-10">
          <PopupMenuAnimated items={popup_items}
                             isOpen={is_open}
                             className={classNames(
                               'absolute-center-x',
                               hover_effect_on && popup_direction === 'down' && 'top-1',
                               hover_effect_on && popup_direction !== 'down' && 'bottom-8',
                               !hover_effect_on && popup_direction === 'down' && 'top-5',
                               !hover_effect_on && popup_direction !== 'down' && 'bottom-6',
                             )}
                             close={() => set_is_open(false)} />
        </div>
      )}
    </div>
  )
}
