import React from 'react'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'
import {TabsBtn} from '../../primitives/Tabs'

export default function TabBtns({tabs, className = 'pb-4'}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames('flex align-bottom text-xs', className)}>
      <ul className="inline-flex svg-font items-center text-[0.925em]">
        {tabs.map((tab, i) => (
          <TabsBtn  key={i}
                    index={i}
                    render={({active}) => (
                      <div className={classNames(
                        'px-[1.3em] py-[0.3em]',
                        'select-none',
                        'border-r border-t',
                        i === 0 && 'border-l',
                        'rounded-b-none',
                        theme_ctx.classes.skin.border_color,
                        theme_ctx.classes.skin.border_radius_default,
                        theme_ctx.classes.typography.input_label,
                        active ? theme_ctx.classes.skin.tab_btn.active : theme_ctx.classes.skin.tab_btn.default)}
                      >
                        {tab.label}
                      </div>
                    )} />
        ))}
      </ul>
      <div className={classNames(
        'flex-1 border-b',
        theme_ctx.classes.skin.border_color_lighter,
      )}
      ></div>
    </div>
  )
}
