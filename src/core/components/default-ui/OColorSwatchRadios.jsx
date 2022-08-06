import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import OClearSelectionBtn from './OClearSelectionBtn'

const with_bottom_triangle = false

const shared_triangle_border_styles = {
  width:       '0',
  height:      '0',
  borderLeft:  '5px solid transparent',
  borderRight: '5px solid transparent',
}

function Swatch({output_class_or_hex, is_first, is_last, active, ...props}) {
  const theme_ctx = useThemeContext()
  const is_hex = output_class_or_hex.includes('#')

  const classNames_triangle = classNames(
    'border absolute-center-x pointer-events-none',
    theme_ctx.classes.skin.swatch_indicator_triangle,
  )

  return (
    <div className="relative flex flex-col items-center" {...props}>
      {active && (
        <div className={classNames_triangle}
             style={{
               top:            '-5px',
               borderTopWidth: '5px',
               borderBottom:   'none',
               ...shared_triangle_border_styles,
             }} />
      )}
      <div style={{backgroundColor: is_hex && output_class_or_hex}}
           className={classNames(
             'w-[21px] h-[21px] cursor-pointer',
             theme_ctx.classes.skin.border_radius_default,
             !is_first && !is_last && '!rounded-none',
             is_first && 'rounded-r-none',
             is_last && 'rounded-l-none',
             !is_hex && output_class_or_hex,
           )}
      ></div>

      {active && with_bottom_triangle && (
        <div className={classNames_triangle}
             style={{
               bottom:            '-5px',
               borderBottomWidth: '5px',
               borderTop:         'none',
               ...shared_triangle_border_styles,
             }} />
      )}
    </div>
  )
}

export default function OColorSwatchRadios({
  id,
  palette,
  value,
  cb__click,
  cb__clear,
  field_def,
  className,
  style,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div style={style}
         className={classNames(
           'border',
           theme_ctx.classes.skin.border_color,
           theme_ctx.classes.skin.input.bg,
           theme_ctx.classes.skin.border_radius_default,
           className,
         )}
         {...props}
    >
      {palette && palette.length > 0 && palette.map((palette_group, j) => {
        return (
          <div className="flex flex-wrap" key={j}>
            {palette_group?.colors &&
             palette_group.colors.length > 0 &&
             palette_group.colors.map(((color, i) => {
               return (
                 <Swatch key={`${id}--${i}`}
                         is_first={i === 0}
                         is_last={i === Object.entries(palette).length - 1}
                         output_class_or_hex={color.output_class_or_hex}
                         active={color.value === value}
                         onClick={() => cb__click(color.value)} />
               )
             }))}
          </div>
        )
      })
      }

      {cb__clear && field_def.clearable && (
        <OClearSelectionBtn onClick={cb__clear} className="text-lg" />
      )}
    </div>
  )
}
