import React, {useState} from 'react'
import {usePageData} from '../../contexts/PageDataContext'
import {humanify_str} from '../../definitions/utils'
import BlockSection from './Block/BlockSection'

export default function NestedBlockWrapper({field_def, field_name, index, containing_data_item, children}) {
  const ctx                    = usePageData()
  const title                  = field_def.description || humanify_str(field_def.name)
  const seamless               = field_def.seamless === true
  const optional               = field_def.optional === true && !seamless
  const initially_open         = (field_def.initially_open || seamless) || false
  const [enabled, set_enabled] = useState(!optional ? true : containing_data_item[field_name]?.__enabled)

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
                  field_def={field_def.nested_block}
                  field_name={field_name}
                  children={children}
                  is_first={index === 0}
                  disable_bottom_pad={true}
                  containing_data_item={containing_data_item}
                  optional={optional}
                  seamless={seamless}
                  enabled={enabled}
                  toggle_enabled={cb__toggle_enabled}
                  initially_open={initially_open} />
  )
}
