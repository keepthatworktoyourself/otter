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
  set_open,
  onClick,
  optional,
  enabled,
  toggle_enabled,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'mb-2',
      'select-none',
      'flex items-center',
      'text-xs',
      !optional && 'cursor-pointer',
      heading_align === 'right' && 'justify-end',
      heading_align === 'center' && 'justify-center',
      theme_ctx.classes.typography.heading,
      className,
    )}
         onClick={!optional ? onClick : null}
         {...props}
    >
      <div className="flex items-center justify-between space-x-2 w-full">

        <div className={enabled ? '' : 'cursor-not-allowed'}>
          <div className={classNames(
            'inline-flex items-center',
            'space-x-1 cursor-pointer',
            !enabled && 'opacity-40 pointer-events-none',
          )}
               onClick={optional ? onClick : null}
          >
            <span>{heading}</span>
            {enabled && (
              <span className={classNames(
                'svg-font fill-current',
                'transition-transform',
                open && 'rotate-180',
              )}
              >
                <ChevronDownSolid />
              </span>
            )}
          </div>
        </div>

        {optional && (
          <OSwitch on={enabled}
                   className="text-[1.1em]"
                   set_on={() => {
                     toggle_enabled(!enabled)
                     set_open(enabled ? false : true)
                   }} />
        )}

      </div>
    </div>
  )
}
