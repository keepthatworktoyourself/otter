import React, {useState} from 'react'
import {PlusOutline} from '@graywolfai/react-heroicons'
import Icons from './Icons'
import {usePageData} from '../PageDataContext'
import PopupMenu from './PopupMenu'
import {blocks_are_simple, humanify_str} from '../definitions/utils'
import styles from '../definitions/styles'

export default function AddBlockBtn({popup_direction = 'down', suggest, index, msg}) {
  const ctx                    = usePageData()
  const blocks                 = ctx?.blocks || []
  const [is_open, set_is_open] = useState(false)
  const is_flat                = blocks_are_simple(blocks)
  const displayed_blocks = is_flat && blocks.filter(item => item && item.hidden !== true)
  const popup_items      = is_flat && displayed_blocks.map(block => (
    block.description || humanify_str(block.type)
  ))

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

  const btn = (
    <button onClick={cb__toggle}
            className={`
              ${styles.button} ${styles.button_pad} ${styles.control_bg}
              ${styles.control_border} ${styles.control_border__interactive}
            `}
    >
      {suggest && (
        <span className="mr-1">
          {msg || 'Insert block'}
        </span>
      )}
      <span className={`c-svg ${suggest ? 'c-svg--toggler' : ''}`}>
        <Icons.Icon Which={PlusOutline} />
      </span>
    </button>
  )

  return (
    <div>
      {is_flat && (
        <>
          {btn}
          {is_open && (
            <PopupMenu items={popup_items}
                       cb={cb__select}
                       offset={{up: 'bottom', down: 'top'}[popup_direction]}
                       center={true} />
          )}
        </>
      )}

      {!is_flat && btn}
    </div>
  )
}
