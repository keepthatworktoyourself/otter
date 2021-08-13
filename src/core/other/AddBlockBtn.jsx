import React, {useState} from 'react'
import Icons from './Icons'
import {usePageData} from '../PageDataContext'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'

export default function AddBlockBtn(props) {
  const ctx                    = usePageData()
  const [is_open, set_is_open] = useState(false)
  const blocks                 = props.blocks || [ ]
  const active                 = is_open ? 'is-active' : ''
  const popup_dir              = props.popup_direction || 'down'
  const suggest                = props.suggest
  const is_flat                = Utils.blocks_are_simple(blocks)
  const displayed_blocks       = is_flat && blocks.filter(b => b && b.hidden !== true)

  function cb__toggle() {
    if (is_flat) {
      set_is_open(!is_open)
    }
    else {
      ctx.open_block_picker(props.index)
    }
  }

  function cb__select(ev) {
    set_is_open(false)
    const block_type = ev.currentTarget.getAttribute('data-block-type')
    ctx.add_item(block_type, props.index)
  }

  const btn = (
    <button onClick={cb__toggle}
            className={`
              ${styles.button} ${styles.button_pad} ${styles.control_bg}
              ${styles.control_border} ${styles.control_border__interactive}
            `}
    >
      {suggest ? (
        <span className="mr-1">
          Insert block
        </span>
      ) : ''}
      <span className={`c-svg ${suggest ? 'c-svg--toggler' : ''}`}>
        <Icons.Icon icon="PlusIcon" />
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
                   ${popup_dir === 'down' ? 'top-9' : ''}
                   ${popup_dir === 'up' ? 'bottom-9' : ''}
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
                  {block.description || Utils.humanify_str(block.type)}
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

