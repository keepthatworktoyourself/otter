import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OGroupedSelectorBtn({
  value,
  label,
  active,
  Icon,
  className,
  style,
  ...props}) {
  const theme_ctx = useThemeContext()

  return (
    <a data-value={value}
       className={classNames(
         'cursor-pointer',
         'text-xxs',
         'block',
         'border-l',
         theme_ctx.classes.skin.border_color,
         theme_ctx.classes.typography.input_label,
         className,
       )}
       {...props}
    >
      <div className={classNames(
        active ?
          theme_ctx.classes.skin.selector_btn.active :
          theme_ctx.classes.skin.selector_btn.default,
      )}
           style={{padding: '0.3em 1.3em', ...style}}
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
