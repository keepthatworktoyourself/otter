import React from 'react'
import Icons from './Icons'

export default function({cb__clear}) {
  return (
    <div className="inline-block">
      <a className="cursor-pointer text-gray-600 hover:text-gray-400" onClick={cb__clear}>
        <Icons.Icon icon="XIcon" />
      </a>
    </div>
  )
}

