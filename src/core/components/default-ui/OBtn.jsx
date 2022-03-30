import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OBtn({
  buttonStyle = 'secondary',
  LeadingIcon,
  TrailingIcon,
  label = 'Btn Label',
  className,
  href,
  type,
  disabled = false,
  newTab = false,
  Tag = 'div',
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <Tag href={!disabled && href}
         disabled={disabled}
         type={type}
         className={classNames(
           'relative inline-flex justify-center ',
           'border focus:outline-none',
           disabled ? 'opacity-30 pointer-events-none cursor-not-allowed' : 'cursor-pointer',
           'select-none',
           theme_ctx.classes.skin.btns[buttonStyle],
           className,
         )}
         target={newTab ? '_blank' : null}
         rel={newTab ? 'noopener noreferrer' : null}
         style={{padding: '1em 2.2em', ...style}}
         {...props}
    >
      <div className={classNames(
        'inline-flex items-center',
        'leading-none',
        'svg-font',
        buttonStyle === 'primary' && 'dark',
        'OBtn__text',
      )}
      >
        {LeadingIcon && (
          <LeadingIcon aria-hidden="true"
                       className="OBtn__icon"
                       style={{
                         fontSize:    '1.3em',
                         marginRight: '0.33em',
                       }} />
        )}
        <span className="font-semibold">{label}</span>
        {TrailingIcon && (
          <TrailingIcon aria-hidden="true"
                        className="OBtn__icon"
                        style={{
                          fontSize:   '1.3em',
                          marginLeft: '0.33em',
                        }} />
        )}
      </div>
    </Tag>
  )
}
