import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OGroupedSelectorBtn({
  value,
  label,
  active,
  Icon,
  index,
  className,
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <a data-value={value}
       className={classNames(
         'cursor-pointer',
         'text-xxs',
         'block',
         index !== 0 && 'border-l',
         'select-none',
         theme_ctx.classes.skin.border_color,
         theme_ctx.classes.typography.input_label,
         className,
       )}
       {...props}
    >
      <div style={style}
           className={classNames(
             'px-[1.3em] py-[0.3em]',
             active ?
               theme_ctx.classes.skin.selector_btn.active :
               theme_ctx.classes.skin.selector_btn.default,
           )}
      >
        {Icon && (
          <span className="svg-font"
                style={{fontSize: '1.5em'}}
          >
            <Icon />
          </span>
        )}
        {!Icon && label}
      </div>
    </a>
  )
}
