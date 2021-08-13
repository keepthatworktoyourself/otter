import React from 'react'
import Icons from '../other/Icons'
import styles from '../definitions/styles'

export default function BlockDeleteBtn({cb__delete, classes}) {
  return (
    <a onClick={cb__delete}
       className={`
         absolute block
         ${styles.button} ${styles.button_pad__sm} ${styles.control_bg}
         ${styles.control_border} ${styles.control_border__interactive}
         ${classes}
       `}
    >
      <Icons.Icon icon="XIcon" />
    </a>
  )
}

