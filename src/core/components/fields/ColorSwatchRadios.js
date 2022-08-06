import React from 'react'
import OColorSwatchRadios from '../default-ui/OColorSwatchRadios'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function ColorSwatchRadios({field_def, containing_data_item}) {
  const ctx           = usePageData()
  const uid           = `${containing_data_item.__uid}-${field_def.name}`
  const input_name    = `ColorSwatchRadios-${uid}`
  const value         = containing_data_item[field_def.name]
  const palette       = evaluate(field_def.palette || { })
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''

  function cb__click(new_value) {
    containing_data_item[field_def.name] = new_value
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  function cb__clear() {
    containing_data_item[field_def.name] = null
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  return (
    <OColorSwatchRadios id={input_name}
                        palette={palette}
                        value={display_value}
                        field_def={field_def}
                        cb__click={cb__click}
                        cb__clear={cb__clear} />
  )
}
