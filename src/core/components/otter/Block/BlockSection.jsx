import React, {useState} from 'react'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import BlockSectionHeading from './BlockSectionHeading'

export default function BlockSection({
  initially_open = true,
  heading,
  heading_align,
  children,
  is_first,
  with_x_pad = true,
  enabled = true,
  optional,
  toggle_enabled,
  ...props
}) {
  const theme_ctx = useThemeContext()
  const [open, set_open] = useState(initially_open || !heading)

  return (
    <div className={classNames(
      'w-full',
      !is_first && 'border-t',
      !is_first && theme_ctx.classes.skin.border_color,
      !with_x_pad && 'px-4 min-w-[calc(100%+2rem)] relative left-[-1rem] max-w-none',
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
                             with_x_pad={with_x_pad}
                             with_top_pad={!is_first} />
      )}

      <CollapseTransition collapsed={!open || !enabled}
                          initialOverflowValue="visible"
      >
        <div className={classNames(
          'pb-4',
          heading ? 'pt-0' : 'pt-4',
          with_x_pad && 'px-4',
          'flex flex-wrap gap-y-3 gap-x-8 items-end',
        )}
        >
          {children}
        </div>
      </CollapseTransition>
    </div>
  )
}
