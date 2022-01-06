import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import styles from '../../definitions/styles'
import {classNames} from '../../helpers/style'

export default function OTextarea({monospaced, className, style, ...props}) {
  const theme_ctx = useThemeContext()

  return (
    <textarea className={classNames(
      'w-full',
      'outline-none',
      'border',
      theme_ctx.classes.skin.border_color,
      monospaced && 'monospace',
      className,
    )}
              style={{
                minHeight:     '5rem',
                paddingTop:    styles.skin.input_pad_y_larger,
                paddingRight:  styles.skin.input_pad_x,
                paddingBottom: styles.skin.input_pad_y_larger,
                paddingLeft:   styles.skin.input_pad_x,
                ...style,
              }}
              {...props} />
  )
}
