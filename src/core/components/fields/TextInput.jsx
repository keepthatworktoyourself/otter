import React, {useRef, useState} from 'react'
import OInput from '../default-ui/OInput'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function TextInput({
  field_def,
  parent_block_data,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const {name, placeholder, mini} = field_def
  const value         = parent_block_data[name]
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''
  const ref           = useRef()

  function cb__change(ev) {
    parent_block_data[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <OInput value={display_value}
            onChange={cb__change}
            placeholder={placeholder}
            ref={ref}
            mini={mini} />
  )
}
