import React from 'react'
import Icons from '../other/Icons'
import styles from '../definitions/styles'

export default function({cb__delete, classes}) {
  return (
    <a className={`absolute block ${styles.button} ${styles.button_pad__sm} ${styles.control_bg} ${styles.control_border} ${styles.control_border__interactive}, ${classes}`}
       onClick={cb__delete}
    >
      <Icons.Icon icon="XIcon" />
    </a>
  )
}

