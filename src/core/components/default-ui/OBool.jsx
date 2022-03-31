import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import OGroupedSelectorBtn from './OGroupedSelectorBtn'

export default function OBool({
  yes_label,
  no_label,
  value,
  onClick,
  className,
  field_def,
  ...props
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'inline-flex border overflow-hidden',
      theme_ctx.classes.skin.border_color,
      theme_ctx.classes.skin.border_radius_default,
      className,
    )}
         {...props}
    >
      <OGroupedSelectorBtn label={yes_label}
                           onClick={onClick}
                           data-value="yes"
                           index={0}
                           active={value} />
      <OGroupedSelectorBtn label={no_label}
                           onClick={onClick}
                           data-value="no"
                           index={1}
                           active={!value} />
    </div>
  )
}
