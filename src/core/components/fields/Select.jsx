import React from 'react'
import OSelect from '../default-ui/OSelect'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function Select({field_def, containing_data_item, ...props}) {
  const ctx           = usePageData()
  const uid           = `${containing_data_item.__uid}-${field_def.name}`
  const value         = containing_data_item[field_def.name]
  const opts_raw      = field_def.options || { }
  const opts          = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''

  function cb__clear() {
    containing_data_item[field_def.name] = null
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  return (
    <OSelect id={uid}
             options={opts}
             value={display_value}
             cb__change={cb__change}
             cb__clear={cb__clear}
             {...props} />

  )
}
