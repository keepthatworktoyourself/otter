import React from 'react'
import OFieldWrapper from '../default-ui/OFieldWrapper'
import {humanify_str} from '../../definitions/utils'

const class_map = {
  auto: 'flex-initial',
  half: '',
  full: 'w-full',
}

export default function GridLayoutItem({field_def, children}) {
  // Note: Might well want to rethink width/layout implementation
  const flow = field_def.width || 'full'
  const layout_class = class_map[flow]

  return (
    <div className={layout_class}
         style={flow === 'half' ? {
           flexBasis: 'calc(50% - 1rem)',
         } : {}}
    >
      <OFieldWrapper field_def={field_def}
                     label={field_def.description || humanify_str(field_def.name)}
      >
        {children}
      </OFieldWrapper>
    </div>
  )
}
