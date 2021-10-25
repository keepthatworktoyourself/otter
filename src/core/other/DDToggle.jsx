import React from 'react'
import ChevronDownOutline from 'simple-react-heroicons/icons/ChevronDownOutline'

export default function DDToggle({marginLeft, is_open, cb}) {
  const l_margin = marginLeft || '0.3rem'
  const attrs = {
    style: {
      marginLeft: l_margin,
      transform:  `rotate(${is_open ? '180' : '0'}deg)`,
    },
  }

  return (
    <span className="icon c-svg c-svg--toggler"
          onClick={cb || null}
          {...attrs}
    >
      <ChevronDownOutline />
    </span>
  )
}
