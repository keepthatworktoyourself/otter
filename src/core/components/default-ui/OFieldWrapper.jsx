import React from 'react'
import {humanify_str} from '../../definitions/utils'
import OFieldLabel from './OFieldLabel'

export default function OFieldWrapper({
  children,
  field_def = {},
  ...props
}) {
  const {class_wrapper, class_label, class_field} = field_def
  const label = field_def?.with_label !== false && (field_def.description || humanify_str(field_def.name))

  return (
    <div className={class_wrapper || 'w-full'}
         {...props}
    >
      {label && (
        <OFieldLabel label={label}
                     className={class_label} />
      )}

      <div className={class_field}>{children}</div>
    </div>
  )
}
