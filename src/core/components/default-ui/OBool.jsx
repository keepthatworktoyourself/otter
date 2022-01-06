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
      'inline-flex border-t border-r border-b',
      theme_ctx.classes.skin.border_color,
      className,
    )}
         {...props}
    >
      <OGroupedSelectorBtn label={yes_label}
                           onClick={onClick}
                           data-value="yes"
                           active={value} />
      <OGroupedSelectorBtn label={no_label}
                           onClick={onClick}
                           data-value="no"
                           active={!value} />
    </div>
  )
}
