import React, {useEffect, useState} from 'react'

const collapsed_styles = {
  marginBottom: '-2000px',
  visibility:   'hidden',
  maxHeight:    '0',
  transition:   'margin-bottom 0.3s cubic-bezier(1, 0, 1, 1), visibility 0s 0.3s, max-height 0s 0.3s',
}

const not_collapsed_styles = {
  marginBottom: '0',
  maxHeight:    '1000000px',
  transition:   'margin-bottom 0.3s cubic-bezier(0, 0, 0, 1)',
}

export default function CollapseTransition({
  collapsed = false,
  style,
  children,
  initialOverflowValue = 'hidden',
  ...props
}) {
  const [overflow, set_overflow] = useState(initialOverflowValue) // having initial as hidden seems to fix a slight flicker on repeater item DND drop/move action

  useEffect(() => {
    if (collapsed) {
      set_overflow('hidden')
    }
  }, [collapsed])

  return (
    <div style={{...style, overflow: overflow}} {...props}>
      <div style={collapsed ? collapsed_styles : not_collapsed_styles}
           onTransitionEnd={ev => {
             if (ev.propertyName === 'margin-bottom' && !collapsed) {
               set_overflow('visible')
             }
           }}
      >
        {children}
      </div>
    </div>
  )
}
