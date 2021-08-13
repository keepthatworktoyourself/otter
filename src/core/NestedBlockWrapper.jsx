import React, {useState} from 'react'
import Toggle from 'react-toggle'
import {usePageData} from './PageDataContext'
import Utils from './definitions/utils'
import DDToggle from './other/DDToggle'
import styles from './definitions/styles'


export default function NestedBlockWrapper(props) {
  const ctx                        = usePageData()
  const [collapsed, set_collapsed] = useState(true)
  const field_def                  = props.field_def
  const containing_data_item       = props.containing_data_item
  const title                      = field_def.description || Utils.humanify_str(field_def.name)
  const is_optional = field_def.optional
  const is_enabled = (
    !is_optional ||
    Utils.optional_nested_block__is_enabled(field_def.name, containing_data_item)
  )

  function cb__toggle_enabled(ev) {
    ev.currentTarget.blur()

    if (props.field_def.optional) {
      Utils.optional_nested_block__set_enabled(
        props.field_def.name,
        props.containing_data_item,
        ev.currentTarget.checked
      )
    }

    if (!ev.currentTarget.checked) {
      set_collapsed(true)
    }

    ctx.value_updated()
    ctx.should_redraw()
    ctx.block_toggled()
  }


  function cb__toggle_collapse(ev) {
    const is_enabled = (
      !field_def.optional ||
      Utils.optional_nested_block__is_enabled(field_def.name, containing_data_item)
    )

    if (is_enabled) {
      set_collapsed(!collapsed)
      ctx.should_redraw()
      ctx.block_toggled()
    }
  }

  return (
    <div>
      <div>
        <h4 className="pb-2 cursor-pointer font-semibold">
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
            {props.children}
          </div>
        </div>
      )}
    </div>
  )
}

