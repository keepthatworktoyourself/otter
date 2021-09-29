import React from 'react'
import FieldLabel from '../other/FieldLabel'
import styles from '../definitions/styles'

export default function ErrorField({text, field_def = { }, __is_top_level}) {
  return (
    <div className={styles.field}>
      <FieldLabel label='Error' is_top_level={__is_top_level} />
      <p>{text || field_def.text}</p>
    </div>
  )
}

