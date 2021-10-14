import React, {useState} from 'react'
import Toggle from 'react-toggle'
import {usePageData} from './PageDataContext'
import {
  humanify_str,
  optional_nested_block__is_enabled,
  optional_nested_block__set_enabled,
} from './definitions/utils'
import DDToggle from './other/DDToggle'
import styles from './definitions/styles'

export default function NestedBlockWrapper({field_def, containing_data_item, children, ...props}) {
  const ctx                        = usePageData()
  const [collapsed, set_collapsed] = useState(true)
  const title       = field_def.description || humanify_str(field_def.name)
  const is_optional = field_def.optional
  const is_enabled = (
    !is_optional ||
    optional_nested_block__is_enabled(field_def.name, containing_data_item)
  )

  function cb__toggle_enabled(ev) {
    ev.currentTarget.blur()

    if (field_def.optional) {
      optional_nested_block__set_enabled(
        field_def.name,
        containing_data_item,
        ev.currentTarget.checked,
      )
    }

    if (!ev.currentTarget.checked) {
      set_collapsed(true)
    }

    ctx.value_updated()
    ctx.redraw()
    ctx.block_toggled()
  }


  function cb__toggle_collapse(ev) {
    const is_enabled = (
      !field_def.optional ||
      optional_nested_block__is_enabled(field_def.name, containing_data_item)
    )

    if (is_enabled) {
      set_collapsed(!collapsed)
      ctx.redraw()
      ctx.block_toggled()
    }
  }

  return (
    <div>
      <div>
        <h4 className="pb-2 cursor-pointer font-semibold text-xs">
          <span className="nbw-toggle inline-block" onClick={cb__toggle_collapse} >
            {title}
            {is_enabled && <DDToggle is_open={!collapsed} cb={cb__toggle_collapse} />}
          </span>

          {is_optional && (
            <span className="relative pl-2 top-px">
              <Toggle checked={is_enabled} icons={false} onChange={cb__toggle_enabled} />
            </span>
          )}
        </h4>
      </div>

      {is_enabled && !collapsed && (
        <div className="pb-2">
          <div className={`${styles.nested_block} ${styles.control_bg} p-4 pb-0`}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

