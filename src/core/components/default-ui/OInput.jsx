import React, {forwardRef} from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

const OInput = forwardRef(({value, onChange, className, style, Icon, ...props}, ref) => {
  // Note that the ref must be supplied by parent for cursor positioning to work
  const theme_ctx = useThemeContext()

  function change(ev) {
    const cursor = ev.target.selectionStart
    onChange?.(ev)
    setTimeout(() => {
      if (ref?.current) {
        ref.current.selectionStart = cursor
        ref.current.selectionEnd = cursor
      }
    })
  }

  return (
    <div className={classNames('relative', className)}>
      {Icon && (
        <div className="svg-font absolute-center-y pl-[0.75em] opacity-30">
          <Icon className="text-[1.2em]" />
        </div>
      )}

      <input type="text"
             className={classNames(
               'w-full',
               'outline-none',
               'border',
               theme_ctx.classes.skin.input.bg,
               theme_ctx.classes.skin.border_color,
               theme_ctx.classes.skin.border_focus,
               theme_ctx.classes.skin.border_radius_default,
               theme_ctx.classes.typography.input,
               Icon && 'pl-[2.5em]',
             )}
             ref={ref}
             style={style}
             value={value || ''}
             onChange={change}
             {...props} />
    </div>
  )
})

export default OInput
