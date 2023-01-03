import React from 'react'
import OBool from '../default-ui/OBool'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function Bool({field_def, parent_block_data}) {
  const ctx                  = usePageData()
  const yes_label            = field_def.yes_label || 'Yes'
  const no_label             = field_def.no_label  || 'No'
  const value                = parent_block_data[field_def.name]
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || false

  function cb__click(ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      parent_block_data[field_def.name] = true
    }
    else {
      parent_block_data[field_def.name] = false
    }
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  return (
    <OBool yes_label={yes_label}
           no_label={no_label}
           onClick={cb__click}
           value={display_value} />

  )
}

