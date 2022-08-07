import React from 'react'
import OSelect from '../default-ui/OSelect'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function Select({field_def, containing_data_item, is_display_if_target, ...props}) {
  const ctx                   = usePageData()
  const {name, options, mini} = field_def
  const uid                   = `${containing_data_item.__uid}-${name}`
  const value                 = containing_data_item[name]
  const opts_raw              = options || { }
  const opts                  = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
  const default_value         = evaluate(field_def.default_value)
  const display_value         = (value === undefined ? default_value : value) || ''

  function cb__clear() {
    containing_data_item[name] = null
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  function cb__change(ev) {
    containing_data_item[name] = ev.target.value
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  return (
    <OSelect id={uid}
             options={opts}
             value={display_value}
             cb__change={cb__change}
             cb__clear={cb__clear}
             mini={mini}
             {...props} />

  )
}
