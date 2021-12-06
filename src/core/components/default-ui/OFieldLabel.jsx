import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OFieldLabel({
  label,
  with_bottom_margin = true,
  min_width,
  className,
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      theme_ctx.classes.typography.input_label,
      'mr-2 whitespace-nowrap',
      with_bottom_margin && 'mb-1',
      className,
    )}
         style={{
           fontSize: '0.85em',
           ...style,
         }}
         {...props}
    >
      <span>{label}</span>
    </div>
  )
}
