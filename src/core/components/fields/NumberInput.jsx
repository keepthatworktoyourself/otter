import React, {useRef, useState} from 'react'
import OInput from '../default-ui/OInput'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function NumberInput({
  field_def,
  parent_block_data,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const {name, min, max, step, mini} = field_def
  const value         = parent_block_data[name]
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''
  const ref           = useRef()

  function cb__change(ev) {
    parent_block_data[name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <OInput value={display_value}
            type="number"
            min={min}
            max={max}
            step={step}
            onChange={cb__change}
            ref={ref}
            mini={mini} />
  )
}
