import React from 'react'
import PlusSolid from 'simple-react-heroicons/icons/PlusSolid'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'

export default function AddItemPillBtn({
  onClick,
  className,
  style,
  size = 'lg',
  classNameBg,
  classNameText,
}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'cursor-pointer svg-font',
      'rounded-3xl py-1',
      size === 'md' && 'px-4',
      size === 'lg' && 'px-8',
      classNameBg || theme_ctx.classes.skin.add_block_btn.bg,
      classNameText || theme_ctx.classes.skin.add_block_btn.text,
      className,
    )}
         style={style}
         onClick={onClick}
    >
      <PlusSolid />
    </div>
  )
}