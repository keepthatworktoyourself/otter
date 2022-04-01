import React, {useRef} from 'react'
import TrashSolid from 'simple-react-heroicons/icons/TrashSolid'
import OBtn from '../../default-ui/OBtn'
import {classNames} from '../../../helpers/style'
import PopoverAnimation from '../../primitives/PopoverAnimation'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import design_options from '../../../definitions/design-options'
import {useThemeContext} from '../../../contexts/ThemeContext'

function BlockDeleteConfirmPopover({close, delete_func, className}) {
  const ref = useRef()
  useOnClickOutside({ref, handler: () => close?.()})

  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'border',
      theme_ctx.classes.skin.block.bg,
      theme_ctx.classes.skin.popup_menu.shadow,
      theme_ctx.classes.skin.border_color,
      theme_ctx.classes.skin.border_radius_default,
      className,
    )}
         ref={ref}
    >
      <div className="p-4">
        <div className="flex space-x-2 text-xxxs">
          <OBtn label="Cancel"
                onClick={close} />
          <OBtn label="Delete"
                TrailingIcon={TrashSolid}
                buttonStyle="negative"
                onClick={delete_func} />
        </div>
      </div>
    </div>
  )
}

export default function BlockDeleteConfirmPopoverAnimated({
  delete_func,
  isOpen,
  close,
  onExitComplete,
  transformOrigin,
  ...props
}) {
  return (
    <PopoverAnimation Component={(
      <BlockDeleteConfirmPopover close={close}
                                 delete_func={delete_func}
                                 {...props} />
)}
                      isOpen={isOpen}
                      onExitComplete={onExitComplete}
                      transformOrigin={transformOrigin} />
  )
}
