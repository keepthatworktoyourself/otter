import React, {useRef, useState} from 'react'
import OInput from '../default-ui/OInput'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function TextInput({
  field_def,
  containing_data_item,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const value         = containing_data_item[field_def.name]
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''
  const placeholder   = field_def.placeholder
  const ref           = useRef()

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <OInput value={display_value}
            onChange={cb__change}
            placeholder={placeholder}
            ref={ref} />
  )
}
