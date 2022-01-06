import React from 'react'
import {useThemeContext} from '../../contexts/ThemeContext'
import styles from '../../definitions/styles'
import {classNames} from '../../helpers/style'

export default function OInput({value, onChange, className, style, ...props}) {
  const theme_ctx = useThemeContext()

  return (
    <input type="text"
           className={classNames(
             'w-full',
             'outline-none',
             'border',
             theme_ctx.classes.skin.input.bg,
             theme_ctx.classes.skin.border_color,
             theme_ctx.classes.skin.border_focus,
             className,
           )}
           style={{
             ...style,
             lineHeight:    '1.9',
             paddingTop:    styles.skin.input_pad_y,
             paddingRight:  styles.skin.input_pad_x,
             paddingBottom: styles.skin.input_pad_y,
             paddingLeft:   styles.skin.input_pad_x,
           }}
           value={value === null ? '' : value}
           onChange={onChange}
           {...props} />
  )
}
