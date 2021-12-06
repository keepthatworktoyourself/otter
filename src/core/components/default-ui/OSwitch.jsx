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
      <span className="sr-only">{label}</span>
      <span aria-hidden="true"
            style={{
              width:     '1em',
              height:    '1em',
              transform: on && 'translateX(calc(150% - 4px))',
            }}
            className={classNames(
              theme_ctx.classes.skin.switch.btn,
              'pointer-events-none rounded-full',
              'transform transition-transform ease-in-out',
            )}
      ></span>
    </button>
  )
}
