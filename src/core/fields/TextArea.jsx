import React, {useState} from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'

export default function TextArea(props) {
  const ctx                  = usePageData()
  const [_, update]          = useState({})
  const field_def            = props.field_def
  const containing_data_item = props.containing_data_item
  const is_top_level         = props.is_top_level
  const value                = containing_data_item[field_def.name]
  const mono                 = field_def.mono || false
  const label                = field_def.description || Utils.humanify_str(field_def.name)
  const default_value        = Utils.evaluate(field_def.default_value)
  const display_value        = (value === undefined ? default_value : value) || ''

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    props.is_display_if_target && ctx.should_redraw()
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
                  fontSize: mono ? '1.1em' : null,
                }}
                value={display_value}
                onChange={cb__change} />
    </div>
  )
}

