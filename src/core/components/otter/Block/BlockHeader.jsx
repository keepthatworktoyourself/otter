import React from 'react'
import ChevronDownSolid from 'simple-react-heroicons/icons/ChevronDownSolid'
import TrashSolid from 'simple-react-heroicons/icons/TrashSolid'
import {classNames} from '../../../helpers/style'
import {TabsBtn} from '../../primitives/Tabs'
import {useThemeContext} from '../../../contexts/ThemeContext'

const BlockHeaderIcon = ({
  Icon,
  active,
  negativeAction = false,
  onClick,
  className,
  is_last,
}) => {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      'px-2',
      'relative svg-font',
      'flex items-center cursor-pointer',
      active ? theme_ctx.classes.skin.block_header_icon.active : theme_ctx.classes.skin.block_header_icon.always,
      negativeAction ? theme_ctx.classes.skin.block_header_icon.negative : theme_ctx.classes.skin.block_header_icon.default,
      is_last && '-mr-2',
      className,
    )}
         onClick={onClick}
    >

      <span className={classNames(
        'absolute-center overflow-hidden w-full',
        'rounded-full',
        theme_ctx.classes.skin.block_header_icon.activeIndictor.bg,
        !active ? 'opacity-0' : theme_ctx.classes.skin.block_header_icon.activeIndictor.opacity,
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

export default function BlockHeader({
  heading,
  block_number,
  tab_btn_icons,
  open,
  toggle_open,
  show_confirm_deletion,
  reveal_show_confirm_deletion,
}) {
  const theme_ctx = useThemeContext()

  return (
    <header className={classNames(
      'select-none',
      'relative flex justify-between',
      theme_ctx.classes.layout.block_headers.wrapper,
      theme_ctx.classes.layout.block_headers.xPad,
      theme_ctx.classes.skin.block_headers.bg,
    )}
    >
      <div className={classNames(
        'flex items-center cursor-pointer',
        theme_ctx.classes.typography.heading,
        theme_ctx.classes.skin.block_headers.heading,
        show_confirm_deletion && 'pointer-events-none',
      )}
           onClick={toggle_open}
      >
        <h1 style={{padding: '1em 0'}} className="flex items-center leading-none">
          {block_number && <span className="w-4">{block_number}</span>}
          <span>{heading}</span>
        </h1>

        <span className={classNames(
          'svg-font fill-current',
          'transform transition-transform',
          'p-1',
          open && 'rotate-180',
        )}
        >
          <ChevronDownSolid />
        </span>
      </div>

      <div className="flex svg-font items-center" style={{fontSize: '1.25em'}}>

        {tab_btn_icons && tab_btn_icons.length && tab_btn_icons.map((Icon, i) => (
          <TabsBtn  key={`tab-btn--${i}`}
                    index={i}
                    render={({active}) => (
                      <BlockHeaderIcon Icon={Icon}
                                       active={active}
                                       onClick={() => !open && toggle_open()} />
                    )} />
        ))}

        {reveal_show_confirm_deletion && (
          <BlockHeaderIcon negativeAction={true}
                           Icon={TrashSolid}
                           onClick={reveal_show_confirm_deletion}
                           is_last={true}
                           className={classNames(
                             show_confirm_deletion && 'opacity-20 pointer-events-none',
                           )} />
        )}
      </div>
    </header>
  )
}
