import React from 'react'
import ChevronDownSolid from 'simple-react-heroicons/icons/ChevronDownSolid'
import {useThemeContext} from '../../../contexts/ThemeContext'
import classes from '../../../definitions/classes'
import {classNames} from '../../../helpers/style'
import OSwitch from '../../default-ui/OSwitch'

export default function BlockSectionHeading({
  heading,
  heading_align = 'right',
  className = classes.skin.block.bg,
  open,
  with_x_pad,
  with_top_pad = true,
  onClick,
  is_enabled,
  enabled,
  optional,
  toggle_enabled,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'select-none',
      'flex items-center',
      'text-xs',
      !optional && 'cursor-pointer',
      heading_align === 'right' && 'justify-end',
      heading_align === 'center' && 'justify-center',
      with_top_pad ? 'pt-5 pb-3' : 'pt-1 pb-3',
      with_x_pad && 'px-4',
      theme_ctx.classes.typography.heading,
      className,
    )}
         onClick={!optional ? onClick : null}
         {...props}
    >
      <div className="flex items-center justify-between space-x-2 w-full">

        <div className={classNames(
          'inline-flex items-center',
          'space-x-1 cursor-pointer',
          !enabled && 'opacity-30 pointer-events-none',
        )}
             onClick={optional ? onClick : null}
        >
          <span>{heading}</span>
          <span className={classNames(
            'svg-font fill-current',
            'transition-transform',
            open && 'rotate-180',
          )}
          >
            <ChevronDownSolid />
          </span>
        </div>

        {optional && <OSwitch on={enabled} set_on={() => toggle_enabled(!enabled)} />}

      </div>
    </div>
  )
}
