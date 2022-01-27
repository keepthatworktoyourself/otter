import React from 'react'
import OFieldLabel from './OFieldLabel'
import {classNames} from '../../helpers/style'

export default function OFieldWrapper({
  label,
  with_label = true,
  children,
  field_def = {},
  className,
  ...props
}) {
  const {align, classNameLabel} = field_def
  const hori = align === 'horizontal'
  const min_width_label = false

  return (
    <div className={classNames(
      hori && 'flex items-center justify-between',
      className,
    )}
         {...props}
    >
      {label && with_label && (
        <OFieldLabel label={label}
                     with_bottom_margin={!hori}
                     style={hori && min_width_label ? {width: '80px'} : null}
                     className={classNameLabel} />
      )}

      {children}
    </div>
  )
}
