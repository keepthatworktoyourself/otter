import React, {useState} from 'react'
import {usePageData} from '../../contexts/PageDataContext'
import {humanify_str} from '../../definitions/utils'
import BlockSection from './block/BlockSection'

export default function NestedBlockWrapper({field_def, index, containing_data_item, children}) {
  const ctx                        = usePageData()
  const title       = field_def.description || humanify_str(field_def.name)
  const is_optional = field_def.optional
  const [is_enabled, set_is_enabled] = useState(containing_data_item[field_def.name]?.__enabled || true)

  function cb__toggle_enabled() {
    if (field_def.optional) {
      containing_data_item[field_def.name].__enabled = !is_enabled
      set_is_enabled(!is_enabled)
      ctx.value_updated()
      ctx.redraw()
      ctx.update_height()
    }
  }

  return (
    <BlockSection heading={title}
                  children={children}
                  withBorderTop={index !== 0}
                  enabled={is_enabled}
                  optional={is_optional}
                  toggle_enabled={cb__toggle_enabled} />
  )
}

