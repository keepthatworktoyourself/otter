import React, {useState} from 'react'
import {PlusOutline} from '@graywolfai/react-heroicons'
import Icons from './Icons'
import {usePageData} from '../PageDataContext'
import {blocks_are_simple, humanify_str} from '../definitions/utils'
import styles from '../definitions/styles'

export default function AddBlockBtn({popup_direction = 'down', suggest, index, msg}) {
  const ctx                    = usePageData()
  const blocks                 = ctx?.blocks || []
  const [is_open, set_is_open] = useState(false)
  const is_flat                = blocks_are_simple(blocks)
  const displayed_blocks       = is_flat && blocks.filter(item => item && item.hidden !== true)

  function cb__toggle() {
    if (is_flat) {
      set_is_open(!is_open)
    }
    else {
      ctx.open_block_picker(index)
    }
  }

  function cb__select(ev) {
    set_is_open(false)
    const block_type = ev.currentTarget.getAttribute('data-block-type')
    ctx.add_item(block_type, index)
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
        <div className="add-block-btn relative">
          {btn}

          {is_open && (
            <div className={`
                   add-block-btn-menu
                   absolute
                   rounded-lg overflow-hidden
                   left-1/2
                   ${styles.control_border}
                   ${popup_direction === 'down' ? 'top-9' : ''}
                   ${popup_direction === 'up' ? 'bottom-9' : ''}
                 `}
                 style={{minWidth: '10rem', transform: 'translateX(-50%)'}}
            >
              {displayed_blocks.map((block, i) => (
                <a className={`
                     add-block-btn-menu-item
                     block p-2
                     cursor-pointer
                     ${styles.control_bg} hover:bg-gray-100 active:bg-gray-200
                     ${i < displayed_blocks.length - 1 ? 'border-b' : ''}
                   `}
                   onClick={cb__select} key={i} data-block-type={block.type}
                >
                  {block.description || humanify_str(block.type)}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {!is_flat && btn}
    </div>
  )
}

