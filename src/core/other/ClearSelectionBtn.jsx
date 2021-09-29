import React from 'react'
import {XOutline} from '@graywolfai/react-heroicons'
import Icons from './Icons'

export default function ClearSelectionBtn({cb__clear}) {
  return (
    <div className="inline-block">
      <a className="cursor-pointer text-gray-600 hover:text-gray-400" onClick={cb__clear}>
        <Icons.Icon Which={XOutline} />
      </a>
    </div>
  )
}

