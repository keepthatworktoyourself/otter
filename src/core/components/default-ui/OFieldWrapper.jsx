import React from 'react'
import components from '../../definitions/components'
import {classNames} from '../../helpers/style'

export default function OFieldWrapper({
  label,
  with_label = true,
  children,
  field_def = {},
  className,
  ...props
}) {
  const {align} = field_def
  const hori = align === 'horizontal'
  const min_width_label = false

  return (
    <div className={classNames(
      align === 'horizontal' && 'flex items-center justify-between',
      className,
    )}
         {...props}
    >
      {label && with_label && (
        <components.FieldLabel label={label}
                               with_bottom_margin={!hori}
                               style={hori && min_width_label ? {width: '80px'} : null} />
      )}

      {children}
    </div>
  )
}
