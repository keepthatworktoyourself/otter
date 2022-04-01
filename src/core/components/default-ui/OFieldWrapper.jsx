import React from 'react'
import {humanify_str} from '../../definitions/utils'
import OFieldLabel from './OFieldLabel'

export default function OFieldWrapper({
  children,
  field_def = {},
  ...props
}) {
  const {wrapper_class, label_class, field_class} = field_def
  const label = field_def?.with_label !== false && (field_def.description || humanify_str(field_def.name))

  return (
    <div className={wrapper_class || 'w-full'}
         {...props}
    >
      {label && (
        <OFieldLabel label={label}
                     className={label_class} />
      )}

      <div className={field_class}>{children}</div>
    </div>
  )
}
