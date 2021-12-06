import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import OClearSelectionBtn from './OClearSelectionBtn'
import OGroupedSelectorBtn from './OGroupedSelectorBtn'

const shared_triangle_border_styles = {
  width:       '0',
  height:      '0',
  borderLeft:  '5px solid transparent',
  borderRight: '5px solid transparent',
}

const Swatch = ({value, active, className, ...props}) => {
  const theme_ctx = useThemeContext()
  const is_hex = value.includes('#')

  const classNames_triangle = classNames(
    'border absolute-center-x',
    theme_ctx.classes.skin.swatch_indicator_triangle,
  )

  return (
    <div className={classNames(
      'relative flex flex-col items-center',
      className,
    )} {...props}
    >

      {active && (
        <div className={classNames_triangle}
             style={{
               top:            '-5px',
               borderTopWidth: '5px',
               borderBottom:   'none',
               ...shared_triangle_border_styles,
             }}
        ></div>
      )}

      <div className={classNames(
        'w-6 h-6 cursor-pointer',
        !is_hex && value,
      )}
           style={{backgroundColor: is_hex && value}}
      ></div>

      {active && (
        <div className={classNames_triangle}
             style={{
               bottom:            '-5px',
               borderBottomWidth: '5px',
               borderTop:         'none',
               ...shared_triangle_border_styles,
             }}
        ></div>
      )}
    </div>
  )
}

export default function ORadios({
  id,
  options,
  value,
  cb__click,
  cb__clear,
  field_def,
  className,
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()
  const icons = field_def.icons
  const color_swatches = field_def.swatches

  return (
    <div className={classNames(
      'relative flex items-center space-x-2',
      className,
    )}
         style={{padding: color_swatches && '3px 0', ...style}}
         {...props}
    >
      {options && Object.keys(options).length > 0 && (
        <div className={classNames(
          'inline-flex border-t border-r border-b',
          theme_ctx.classes.skin.border_color,
        )}
        >
          {Object.entries(options)
            .map(([opt_value, opt_label], i) => !color_swatches ?
              <OGroupedSelectorBtn key={`${id}--${i}`}
                                   label={opt_label}
                                   value={opt_value}
                                   Icon={icons && icons[opt_value] || null}
                                   active={opt_value === value}
                                   onClick={() => cb__click(opt_value)} /> :
              <Swatch key={`${id}--${i}`}
                      value={opt_value}
                      active={opt_value === value}
                      className={i === 0 && `border-l ${theme_ctx.classes.skin.border_color}`}
                      onClick={() => cb__click(opt_value)} />,
            )}
        </div>
      )}

      {cb__clear && field_def.clearable && (
      <OClearSelectionBtn onClick={cb__clear} className="text-lg" />
      )}
    </div>
  )
}
