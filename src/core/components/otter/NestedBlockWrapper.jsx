import React, {useState} from 'react'
import {usePageData} from '../../contexts/PageDataContext'
import {humanify_str} from '../../definitions/utils'
import BlockSection from './Block/BlockSection'

export default function NestedBlockWrapper({field_def, field_name, index, parent_block_data, children}) {
  const ctx                    = usePageData()
  const title                  = field_def.description || humanify_str(field_def.name)
  const seamless               = field_def.seamless === true
  const optional               = field_def.optional === true && !seamless
  const initially_open         = (field_def.initially_open || seamless) || false
  const [enabled, set_enabled] = useState(!optional ? true : parent_block_data[field_name]?.__enabled)

  function cb__toggle_enabled() {
    if (field_def.optional) {
      parent_block_data[field_def.name].__enabled = !enabled
      set_enabled(!enabled)
      ctx.value_updated()
      ctx.redraw()
      ctx.update_height()
    }
  }

  return (
    <BlockSection heading={title}
                  field_def={field_def.nested_block}
                  field_name={field_name}
                  children={children}
                  is_first={index === 0}
                  disable_bottom_pad={true}
                  parent_block_data={parent_block_data}
                  optional={optional}
                  seamless={seamless}
                  enabled={enabled}
                  toggle_enabled={cb__toggle_enabled}
                  initially_open={initially_open} />
  )
}
