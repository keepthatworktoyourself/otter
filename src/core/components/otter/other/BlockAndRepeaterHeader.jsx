import React from 'react'
import ChevronDownSolid from 'simple-react-heroicons/icons/ChevronDownSolid'
import ClipboardCopySolid from 'simple-react-heroicons/icons/ClipboardCopySolid'
import TrashSolid from 'simple-react-heroicons/icons/TrashSolid'
import {TabsBtn} from '../../primitives/Tabs'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {usePageData} from '../../../contexts/PageDataContext'
import {classNames} from '../../../helpers/style'
import deep_clean_obj from '../../../helpers/deep-clean-obj'

function copy_to_clipboard(raw_block_data) {
  navigator.clipboard
    .writeText(JSON.stringify(deep_clean_obj(raw_block_data, ['__uid']), null, 2))
    .then(() =>
      console.log('Copied block data to clipboard.'),
    )
}

export const TabIcon = ({
  Icon,
  active,
  negativeAction = false,
  onClick,
  className,
  iconThemeClassNamesObj = {},
  is_last,
}) => {
  return (
    <div onClick={onClick}
         className={classNames(
           'px-2',
           'relative svg-font',
           'flex items-center cursor-pointer',
           iconThemeClassNamesObj.always,
           active && !negativeAction && iconThemeClassNamesObj.active,
           negativeAction && iconThemeClassNamesObj.negative,
           !active && !negativeAction && iconThemeClassNamesObj.default,
           is_last && '-mr-2',
           className,
         )}
    >
      <span className={classNames(
        'absolute-center overflow-hidden w-full',
        iconThemeClassNamesObj.active_indicator?.border_radius,
        iconThemeClassNamesObj.active_indicator?.bg,
        !active ? 'opacity-0' : iconThemeClassNamesObj.active_indicator?.opacity,
      )}
      >
        <span className="aspect-1x1 w-full block"></span>
      </span>

      <div className="relative">
        <Icon />
      </div>
    </div>
  )
}

export default function BlockAndRepeaterHeader({
  heading,
  index,
  block_numbers,
  tab_btn_icons,
  open,
  toggle_open,
  show_confirm_deletion,
  delete_func,
  classNameBorderRadius,
  classNameBorder,
  classNameBg,
  classNameHeading,
  classNameYPad,
  iconThemeClassNamesObj,
}) {
  const ctx = usePageData()
  const theme_ctx = useThemeContext()

  return (
    <header className={classNames(
      'select-none',
      'relative flex justify-between',
      'text-xs',
      'px-4',
      open ? 'rounded-b-none' : '!border-transparent',
      theme_ctx.classes.skin.border_color,
      classNameBorderRadius,
      classNameBorder,
      classNameBg,
    )}
    >
      <div className={classNames(
        'flex items-center cursor-pointer',
        show_confirm_deletion && 'pointer-events-none',
        theme_ctx.classes.typography.heading,
        classNameHeading,
      )}
           onClick={toggle_open}
      >
        <h1 className={classNames(
          'flex items-center leading-none',
          classNameYPad,
        )}
        >
          {block_numbers && <span className="w-4">{index + 1}</span>}
          <span>{heading}</span>
        </h1>

        <span className={classNames(
          'svg-font fill-current',
          'transition-transform',
          'p-1',
          open && 'rotate-180',
        )}
        >
          <ChevronDownSolid />
        </span>
      </div>

      <div className="flex svg-font items-center" style={{fontSize: '1.25em'}}>
        {ctx.dev_mode && (
          <TabIcon Icon={ClipboardCopySolid}
                   onClick={() => copy_to_clipboard(ctx.data[index])}
                   iconThemeClassNamesObj={iconThemeClassNamesObj} />
        )}

        {tab_btn_icons && tab_btn_icons.map((Icon, i) => (
          <TabsBtn key={`tab-btn--${i}`}
                   index={i}
                   render={({active}) => (
                     <TabIcon Icon={Icon}
                              active={active}
                              iconThemeClassNamesObj={iconThemeClassNamesObj}
                              onClick={() => !open && toggle_open()} />
                   )} />
        ))}

        {delete_func && (
          <TabIcon negativeAction={true}
                   Icon={TrashSolid}
                   onClick={delete_func}
                   is_last={true}
                   iconThemeClassNamesObj={iconThemeClassNamesObj}
                   className={classNames(
                     show_confirm_deletion && 'opacity-20 pointer-events-none',
                   )} />
        )}
      </div>
    </header>
  )
}
