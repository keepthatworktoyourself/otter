import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
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
                minHeight: '5rem',
                ...style,
              }}
              {...props} />
  )
}
