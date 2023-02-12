import React from 'react'
import XCircleSolid from 'simple-react-heroicons/icons/XCircleSolid'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'

export default function OClearSelectionBtn({className, ...props}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'svg-font',
      'cursor-pointer',
      theme_ctx.classes.skin.clear_selection_btn,
      className,
    )} {...props}
    >
      <XCircleSolid />
    </div>
  )
}
