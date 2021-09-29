import React from 'react'
import {XOutline} from '@graywolfai/react-heroicons'
import Icons from '../other/Icons'
import styles from '../definitions/styles'

export default function BlockDeleteBtn({delete_block, classes}) {
  return (
    <a onClick={delete_block}
       className={`
         absolute block
         ${styles.button} ${styles.button_pad__sm} ${styles.control_bg}
         ${styles.control_border} ${styles.control_border__interactive}
         ${classes}
       `}
    >
      <Icons.Icon Which={XOutline} />
    </a>
  )
}

