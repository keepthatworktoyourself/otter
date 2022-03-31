import React from 'react'
import Select from './Select'

export default function SelectMini({...props}) {
  return (
    <Select mini={true} {...props} />
  )
}
