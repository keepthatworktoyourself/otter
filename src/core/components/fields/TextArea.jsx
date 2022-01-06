import React, {useState} from 'react'
import OTextarea from '../default-ui/OTextarea'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function TextArea({
  field_def,
  containing_data_item,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const value         = containing_data_item[field_def.name]
  const mono          = field_def.mono || false
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <OTextarea value={display_value}
               onChange={cb__change}
               monospaced={mono} />
  )
}
