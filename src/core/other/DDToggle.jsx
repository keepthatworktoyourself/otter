import React from 'react'
import {ChevronDownIcon} from '@heroicons/react/outline'

export default function DDToggle(props) {
  const l_margin = props.marginLeft || '0.3rem'

  const attrs = {
    style: {
      marginLeft: l_margin,
      transform: `rotate(${props.is_open ? '180' : '0'}deg)`
    },
  }

  return (
    <span className="icon c-svg c-svg--toggler"
          onClick={props.cb || null}
          {...attrs}>
      <ChevronDownIcon />
    </span>
  )
}

