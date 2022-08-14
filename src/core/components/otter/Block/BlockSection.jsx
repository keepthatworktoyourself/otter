import React, {useState} from 'react'
import {useThemeContext} from '../../../contexts/ThemeContext'
import {classNames} from '../../../helpers/style'
import CollapseTransition from '../../primitives/CollapseTransition'
import {TabsProvider, TabsTab} from '../../primitives/Tabs'
import TabBtns from '../other/TabBtns'
import RecursiveBlockRenderer from '../RecursiveBlockRenderer'
import BlockSectionHeading from './BlockSectionHeading'

const Inner = ({children, seamless, disable_bottom_pad, theme_ctx, bordered}) => (
  <div className={classNames(
    'flex flex-wrap space-y-3 items-end', // provides the default y spacing between fields and flex layout
    !seamless && 'px-4 pt-4',
    !seamless && !disable_bottom_pad && 'pb-4',
    bordered && 'border border-dashed pb-4',
    bordered && theme_ctx.classes.skin.border_radius_default,
    bordered && theme_ctx.classes.skin.border_color,
  )}
  >
    {children}
  </div>
)

export default function BlockSection({
  initially_open = true,
  heading,
  heading_align,
  children,
  is_first,
  enabled = true,
  optional,
  toggle_enabled,
  seamless = false,
  bordered = !seamless,
  disable_bottom_pad = false,
  field_def,
  parent_block_data,
  field_name,
  ...props
}) {
  const theme_ctx        = useThemeContext()
  const [open, set_open] = useState(initially_open || !heading)
  const tabs             = field_def?.tabs || []
  const hasTabs          = tabs && tabs?.length > 0

  return (
    <div className={classNames(
      'w-full',
      !is_first && !seamless && theme_ctx.classes.skin.border_color,
    )}
         {...props}
    >
      {heading && (
        <BlockSectionHeading heading={heading}
                             heading_align={heading_align}
                             open={open}
                             enabled={enabled}
                             toggle_open={() => set_open(!open)}
                             toggle_enabled={toggle_enabled}
                             set_open={set_open}
                             optional={optional} />
      )}

      <CollapseTransition collapsed={!open || !enabled}>
        {hasTabs && (
          <Inner {...{seamless, disable_bottom_pad, theme_ctx, bordered}}>
            <div className="w-full">
              <TabsProvider>
                <TabBtns tabs={tabs} />

                {tabs.map((tab, i) => {
                  const block_fields = field_def.fields
                  const tab_fields = block_fields.filter(field => tab.fields.includes(field.name))
                  return (
                    <TabsTab key={i} index={i}>
                      <Inner seamless={true}>
                        <RecursiveBlockRenderer block_fields={tab_fields}
                                                parent_block_data={parent_block_data}
                                                field_name={field_name} />
                      </Inner>
                    </TabsTab>
                  )
                })}
              </TabsProvider>
            </div>
          </Inner>
        )}

        {!hasTabs && <Inner {...{children, seamless, disable_bottom_pad, theme_ctx, bordered}} />}
      </CollapseTransition>

    </div>
  )
}
