import React from 'react'
import styles from '../definitions/styles'

export default function PopupMenu({items, cb, offset = 'top', center}) {
  return (
    <div className="relative z-2">
      <div className={`
             absolute
             rounded-lg overflow-hidden
             ${styles.control_border}
             ${center ? 'left-1/2' : ''}
             ${offset === 'top' ? 'top-1' : ''}
             ${offset === 'bottom' ? 'bottom-9' : ''}
           `}
           style={{
             minWidth:  '10rem',
             transform: center ? 'translateX(-50%)' : false,
           }}
      >
        {items.map((item, i) => (
          <a key={i}
             onClick={() => cb(i, item)}
             className={`
                 block p-2
                 cursor-pointer
                 ${styles.control_bg} hover:bg-gray-100 active:bg-gray-200
                 ${i < items.length - 1 ? 'border-b' : ''}
               `}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  )
}
