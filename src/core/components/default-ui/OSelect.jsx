import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OSelect({
  id,
  options,
  value,
  cb__change,
  cb__clear,
  className,
  field_def,
  mini,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'relative',
      mini && 'text-xxs',
      className,
    )}
         {...props}
    >
      <select onChange={cb__change}
              id={id}
              className={classNames(
                'block w-full',
                'appearance-none outline-none',
                'focus:ring-transparent',
                'border',
                theme_ctx.classes.skin.border_color,
                theme_ctx.classes.skin.border_focus,
                theme_ctx.classes.skin.border_radius_default,
                theme_ctx.classes.typography.input,
                mini && 'px-[1.3em] py-[0.3em]',
              )}
              value={value}
              style={{fontSize: 'inherit', fontFamily: 'inherit'}}
      >
        {Object.keys(options || { }).length > 0 && [
          <option disabled key={`f${id}--disabled`} value="">Select an option</option>,
          ...Object.entries(options).map(([opt_value, opt_label], i) => (
            <option value={opt_value} key={`f${id}--${i}`}>{opt_label}</option>
          )),
        ]}
      </select>

      {/* TODO cb__clear */}
    </div>
  )
}
