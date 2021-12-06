import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OErrorMessage({
  text,
  className,
  field_def,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <p className={classNames(
      theme_ctx.classes.typography.input_label,
      className,
    )}
       {...props}
    >
      {text}
    </p>
  )
}
