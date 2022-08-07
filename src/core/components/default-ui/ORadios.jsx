import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import OClearSelectionBtn from './OClearSelectionBtn'
import OGroupedSelectorBtn from './OGroupedSelectorBtn'

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

  return (
    <div style={style}
         className={classNames(
           'relative flex items-center space-x-2',
           className,
         )}
         {...props}
    >
      {options && Object.keys(options).length > 0 && (
        <div className={classNames(
          'inline-flex border',
          theme_ctx.classes.skin.border_color,
          theme_ctx.classes.skin.border_radius_default,
        )}
        >
          {Object.entries(options)
            .map(([opt_value, opt_label], i) => (
              <OGroupedSelectorBtn key={`${id}--${i}`}
                                   index={i}
                                   label={opt_label}
                                   value={opt_value}
                                   Icon={icons && icons[opt_value] || null}
                                   active={opt_value === value}
                                   onClick={() => cb__click(opt_value)} />
            ),
            )}
        </div>
      )}

      {cb__clear && field_def.clearable && (
        <OClearSelectionBtn onClick={cb__clear} className="text-lg" />
      )}
    </div>
  )
}
