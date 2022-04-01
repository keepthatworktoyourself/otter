import React, {useState} from 'react'
import {usePageData} from '../../contexts/PageDataContext'
import {humanify_str} from '../../definitions/utils'
import BlockSection from './Block/BlockSection'

export default function NestedBlockWrapper({field_def, field_name, blocks, index, containing_data_item, children}) {
  const ctx                    = usePageData()
  const title                  = field_def.description || humanify_str(field_def.name)
  const optional               = field_def.optional
  const seamless               = field_def.seamless
  const initially_open         = field_def.initially_open || false
  const fallback_enabled_value = !optional ? true : field_def.__enabled_default_value
  const [enabled, set_enabled] = useState(
    containing_data_item[field_def.name]?.__enabled || fallback_enabled_value)

  function cb__toggle_enabled() {
    if (field_def.optional) {
      containing_data_item[field_def.name].__enabled = !enabled
      set_enabled(!enabled)
      ctx.value_updated()
      ctx.redraw()
      ctx.update_height()
    }
  }

  return (
    <BlockSection heading={title}
                  field_def={field_def.nested_block_type}
                  field_name={field_name}
                  blocks={blocks}
                  children={children}
                  is_first={index === 0}
                  enabled={enabled}
                  optional={optional}
                  seamless={seamless}
                  disable_bottom_pad={true}
                  containing_data_item={containing_data_item}
                  toggle_enabled={cb__toggle_enabled}
                  initially_open={initially_open} />
  )
}
