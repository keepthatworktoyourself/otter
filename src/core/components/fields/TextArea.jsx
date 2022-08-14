import React, {useState} from 'react'
import OTextarea from '../default-ui/OTextarea'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function TextArea({
  field_def,
  parent_block_data,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const value         = parent_block_data[field_def.name]
  const mono          = field_def.mono || false
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''
  const placeholder   = field_def.placeholder

  function cb__change(ev) {
    parent_block_data[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <OTextarea value={display_value}
               onChange={cb__change}
               placeholder={placeholder}
               monospaced={mono} />
  )
}
