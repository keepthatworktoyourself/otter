import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OFieldLabel({
  label,
  min_width,
  className = 'mr-2 mb-[0.75em]',
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      theme_ctx.classes.typography.input_label,
      'whitespace-nowrap',
      'leading-none select-none',
      'text-[0.85em]',
      className,
    )}
         style={style}
         {...props}
    >
      <span>{label}</span>
    </div>
  )
}
