import React from 'react'

export default function FieldLabel(props) {
  const style_minwidth = props.min_width ? { minWidth: '9rem' } : { }
  const style_rpadding = { paddingRight: '1rem' }

  return (
    <div className="font-semibold text-gray-800 mb-1" style={{ ...style_minwidth, ...style_rpadding }}>
      <span className="">{props.label}</span>
    </div>
  )
}

