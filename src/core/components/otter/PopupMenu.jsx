import React, {useRef} from 'react'
import {classNames} from '../../helpers/style'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import design_options from '../../definitions/design-options'
import PopoverAnimation from '../primitives/PopoverAnimation'
import {useThemeContext} from '../../contexts/ThemeContext'

function PopupMenu({items, className = 'absolute-center', close, style}) {
  const ref = useRef()
  useOnClickOutside({ref, handler: () => close?.()})

  const theme_ctx = useThemeContext()

  return (
    <div ref={ref}
         className={classNames(
           className,
           'z-10',
         )}
    >
      <div className={classNames(
        'relative z-10',
        'text-left',
        'overflow-hidden',
        'border',
        theme_ctx.classes.skin.border_color,
      )}
           style={{
             minWidth:  '10rem',
             boxShadow: theme_ctx.design_options.block_shadow,
             ...style,
           }}
      >
        {items.map((item, i) => (
          <a key={i}
             onClick={item?.onClick}
             className={classNames(
               'block p-2 cursor-pointer',
               i !== 0 && 'border-t',
               theme_ctx.classes.typography.sub_heading,
               theme_ctx.classes.skin.popup_menu,
             )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default function PopupMenuAnimated({isOpen, close, onExitComplete, ...props}) {
  return (
    <PopoverAnimation Component={<PopupMenu close={close} {...props} />}
                      isOpen={isOpen}
                      onExitComplete={onExitComplete}
                      {...props} />
  )
}
