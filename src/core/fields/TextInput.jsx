import React, {useState} from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import {humanify_str, evaluate} from '../definitions/utils'
import styles from '../definitions/styles'

export default function TextInput(props) {
  const ctx                  = usePageData()
  const [_, update]          = useState({})
  const field_def            = props.field_def
  const containing_data_item = props.containing_data_item
  const is_top_level         = props.is_top_level
  const value                = containing_data_item[field_def.name]
  const label                = field_def.description || humanify_str(field_def.name)
  const default_value        = evaluate(field_def.default_value)
  const display_value        = (value === undefined ? default_value : value) || ''

  function cb__change(ev) {
    containing_data_item[field_def.name] = ev.target.value
    update({})
    ctx.value_updated()
    props.is_display_if_target && ctx.redraw()
  }

  return (
    <div className={`${styles.field}`}>
      <FieldLabel label={label} is_top_level={is_top_level} />

      <input type="text" className={`
               w-full
               outline-none rounded
               ${styles.button_pad} ${styles.control_bg} ${styles.control_border}
               ${styles.control_border__focus}
             `}
             value={display_value}
             onChange={cb__change} />
    </div>
  )
}

