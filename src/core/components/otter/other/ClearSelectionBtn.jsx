import React from 'react'
import XOutline from 'simple-react-heroicons/icons/XOutline'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'
import Icons from './Icons'

export default function ClearSelectionBtn({cb__clear}) {
  const theme_ctx = useThemeContext()

  return (
    <div className="inline-block">
      <a className={classNames(
        'cursor-pointer',
        theme_ctx.classes.skin.clear_selection_btn,
      )} onClick={cb__clear}
      >
        <Icons.Icon Which={XOutline} />
      </a>
    </div>
  )
}
