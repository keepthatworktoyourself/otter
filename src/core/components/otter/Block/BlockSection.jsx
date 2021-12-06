import React, {useState} from 'react'
import design_options from '../../../definitions/design_options'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import BlockSectionHeading from './BlockSectionHeading'

export default function BlockSection({
  initially_open = true,
  heading,
  heading_align,
  children,
  withBorderTop = false,
  with_padding = true,
  skip = false,
  enabled = true,
  optional = false,
  toggle_enabled,
  ...props
}) {
  const [open, set_open] = useState(initially_open || !heading)

  return !skip ? (
    <div className={classNames(withBorderTop && 'border-t border-app-border')} {...props}>
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

      <CollapseTransition collapsed={!open || !enabled} initialOverflowValue="visible">
        <div className={classNames(
          design_options.right_aligned_block_section_headings && 'pb-4',
          !design_options.right_aligned_block_section_headings && 'pb-4',
          !heading ? 'pt-4' : 'pt-0',
          with_padding && 'px-4',
          'flex flex-wrap gap-y-3 gap-x-8 items-end',
        )}
        >
          {children}
        </div>
      </CollapseTransition>

    </div>
  ) : <>{children}</>
}
