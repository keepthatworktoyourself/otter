import React, {useState} from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import {humanify_str, evaluate} from '../definitions/utils'
import styles from '../definitions/styles'

export default function TextArea({
  field_def,
  containing_data_item,
  is_top_level,
  is_display_if_target,
}) {
  const ctx           = usePageData()
  const [_, update]   = useState({})
  const value         = containing_data_item[field_def.name]
  const mono          = field_def.mono || false
  const label         = field_def.description || humanify_str(field_def.name)
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    is_display_if_target && ctx.redraw()
  }

  return (
    <div className="field">
      <FieldLabel label={label} is_top_level={is_top_level} />

      <textarea className={`
                  w-full
                  outline-none rounded
                  ${styles.button_pad} ${styles.control_bg} ${styles.control_border}
                  ${styles.control_border__focus}
                  ${mono ? 'monospace': ''}
                `}
                style={{
                  minHeight: '5rem',
                  fontSize:  mono ? '1.1em' : null,
                }}
                value={display_value}
                onChange={cb__change} />
    </div>
  )
}
