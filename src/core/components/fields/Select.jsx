import React from 'react'
import OSelect from '../default-ui/OSelect'
import {usePageData} from '../../contexts/PageDataContext'
import {evaluate} from '../../definitions/utils'

export default function Select({field_def, parent_block_data, is_display_if_target, ...props}) {
  const ctx                   = usePageData()
  const {name, options, mini} = field_def
  const uid                   = `${parent_block_data.__uid}-${name}`
  const value                 = parent_block_data[name]
  const opts_raw              = options || { }
  const opts                  = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
  const default_value         = evaluate(field_def.default_value)
  const display_value         = (value === undefined ? default_value : value) || ''

  function cb__clear() {
    parent_block_data[name] = null
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  function cb__change(ev) {
    parent_block_data[name] = ev.target.value
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
