import React from 'react'
import components from '../definitions/components'

export default function ErrorField({...props}) {
  return <components.ErrorMessage {...props} />
}

