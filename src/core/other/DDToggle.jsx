import React from 'react'
import Icons from './Icons'


export default function DDToggle(props) {
  const l_margin = props.marginLeft || '0.3rem'

  const attrs = {
    style: {
      marginLeft: l_margin,
      transform: `rotate(${props.is_open ? '180' : '0'}deg)`
    },
  }

  return (
    <span className="icon c-toggler-icon"
          onClick={props.cb || null}
          {...attrs}>
      <Icons.Icon icon="ChevronDownIcon" />
    </span>
  )
}

