import React, {useState} from 'react'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import BlockSectionHeading from './BlockSectionHeading'

export default function BlockSection({
  initially_open = true,
  heading,
  heading_align,
  children,
  withBorderTop,
  with_padding = true,
  enabled = true,
  optional,
  toggle_enabled,
  ...props
}) {
  const [open, set_open] = useState(initially_open || !heading)

  return (
    <div className={classNames(
      'w-full',
      withBorderTop && 'border-t border-app-border',
    )}
         {...props}
    >
      {heading && (
        <BlockSectionHeading heading={heading}
                             heading_align={heading_align}
                             onClick={() => set_open(!open)}
                             open={open}
                             enabled={enabled}
                             toggle_enabled={toggle_enabled}
                             optional={optional}
                             with_padding={with_padding} />
      )}

      <CollapseTransition collapsed={!open || !enabled}
                          initialOverflowValue="visible"
      >
        <div className={classNames(
          'pb-4',
          heading ? 'pt-0' : 'pt-4',
          with_padding && 'px-4',
          'flex flex-wrap gap-y-3 gap-x-8 items-end',
        )}
        >
          {children}
        </div>
      </CollapseTransition>
    </div>
  )
}
