import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OSwitch({
  label,
  on,
  set_on,
  className,
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <button className={classNames(
      'relative inline-flex flex-shrink-0 border-2',
      'border-transparent rounded-full cursor-pointer transition-colors',
      on ? theme_ctx.classes.skin.switch.bg.on : theme_ctx.classes.skin.switch.bg.off,
      className,
    )}
            role="switch"
            tabIndex="0"
            onClick={() => set_on(!on)}
            aria-checked={on ? 'true' : 'false'}
            style={{width: '2.5em', ...style}}
            {...props}
    >
      <span className="sr-only pointer-events-none">{label}</span>
      <span aria-hidden="true"
            style={on ? {
              transform: 'translateX(calc(150% - 4px))',
            } : {}}
            className={classNames(
              theme_ctx.classes.skin.switch.btn,
              'w-[1em] h-[1em]',
              'pointer-events-none rounded-full',
              'transition-transform ease-in-out',
            )}
      ></span>
    </button>
  )
}
