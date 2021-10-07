import React from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import {humanify_str, evaluate} from '../definitions/utils'
import styles from '../definitions/styles'

export default function Bool(props) {
  const ctx                  = usePageData()
  const field_def            = props.field_def
  const containing_data_item = props.containing_data_item
  const is_top_level         = props.is_top_level
  const yes_label            = field_def.yes_label || 'Yes'
  const no_label             = field_def.no_label  || 'No'
  const label                = field_def.description || humanify_str(field_def.name)
  const value                = containing_data_item[field_def.name]
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || false

  function cb__click(ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      containing_data_item[field_def.name] = true
    }
    else {
      containing_data_item[field_def.name] = false
    }
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  const btn_styles = (selected) => `
    inline-block mr-1
    ${styles.button} ${styles.control_border} ${styles.control_border__interactive}
    ${selected ? 'bg-gray-600' : styles.control_bg}
    ${selected ? 'text-gray-50' : ''}
    ${selected ? 'font-semibold' : ''}
    ${styles.button_pad__sm}
  `

  return (
    <div className={`${styles.field}`}>
      <div className="md:flex items-center">

        <div className="mb-2 md:mb-0">
          <FieldLabel label={label}
                      is_top_level={is_top_level}
                      min_width={true} />
        </div>

        <div className={`inline-block md:block mr-2`}>
          <a className={btn_styles(display_value)}
             data-value="yes"
             onClick={cb__click}
          >
            {yes_label}
          </a>

          <a className={btn_styles(!display_value, true)}
             data-value="no"
             onClick={cb__click}
          >
            {no_label}
          </a>
        </div>

        <input className="hidden" type="checkbox" readOnly checked={display_value} />
      </div>
    </div>
  )
}

