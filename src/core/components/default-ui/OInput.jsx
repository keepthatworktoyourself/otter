import React, {forwardRef} from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

// eslint-disable-next-line react/display-name
const OInput = forwardRef(({value, onChange, className, style, Icon, ...props}, ref) => {
  const theme_ctx = useThemeContext()

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
               Icon && 'pl-[2.5em]',
             )}
             ref={ref}
             style={style}
             value={value === null ? '' : value}
             onChange={onChange}
             {...props} />
    </div>
  )
})

export default OInput
