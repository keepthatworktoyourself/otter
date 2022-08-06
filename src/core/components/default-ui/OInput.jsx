import React, {forwardRef} from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

const OInput = forwardRef(({
  value,
  onChange,
  className,
  style,
  Icon,
  type = 'text',
  mini = false,
  ...props},
ref) => {
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
    <div className={classNames('relative', mini && 'text-xxs', className)}>
      {Icon && (
        <div className="svg-font absolute-center-y pl-[0.75em] opacity-30">
          <Icon className="text-[1.2em]" />
        </div>
      )}
      <input type={type}
             ref={ref}
             style={style}
             value={value || ''}
             onChange={change}
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
               mini && 'pl-[1.3em] py-[0.285em]',
               mini && type !== 'number' && 'pr-[1.3em]',
             )}
             {...props} />
    </div>
  )
})

export default OInput
