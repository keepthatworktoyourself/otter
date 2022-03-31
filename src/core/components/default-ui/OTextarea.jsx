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
      theme_ctx.classes.skin.border_radius_default,
      theme_ctx.classes.typography.input,
      theme_ctx.classes.skin.border_focus,
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
