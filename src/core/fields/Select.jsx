import React from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import ClearSelectionBtn from '../other/ClearSelectionBtn'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'

export default function Select(props) {
  const ctx                  = usePageData()
  const field_def            = props.field_def
  const containing_data_item = props.containing_data_item
  const is_top_level         = props.is_top_level
  const uid                  = `${containing_data_item.__uid}-${field_def.name}`
  const value                = containing_data_item[field_def.name]
  const label                = field_def.description || Utils.humanify_str(field_def.name)
  const opts_raw = field_def.options || { }
  const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
  const opt_keys = Object.keys(opts)

  function cb__clear() {
    props.containing_data_item[props.field_def.name] = null
    ctx.value_updated()
    ctx.should_redraw()   // For conditional rendering
  }

  function cb__change(ev) {
    props.containing_data_item[props.field_def.name] = ev.target.value
    ctx.value_updated()
    ctx.should_redraw()   // For conditional rendering
  }

  return (
    <div className={`${styles.field}`}>
      <div className="md:flex items-center">

        <div className="mb-2 md:mb-0">
          <FieldLabel label={label}
                      is_top_level={is_top_level}
                      min_width={true} />
        </div>

        <div className="select inline-block mr-3">
          <select className={`
                    appearance-none
                    outline-none
                    ${styles.control_bg} ${styles.control_border} ${styles.button_pad__sm}
                    ${styles.control_border__focus}
                    pr-7
                  `}
                  value={value || ''}
                  onChange={cb__change}
          >
            {opt_keys.length === 0 && `[Select field has no options!]`}

            {opt_keys.length !== 0 && [
              <option disabled key={`f${uid}--disabled`} value="">Select an option</option>,
              ...opt_keys.map((opt, i) => (
                <option value={opt} key={`f${uid}--${i}`}>{opts[opt]}</option>
              )),
            ]}
          </select>
        </div>

        <ClearSelectionBtn cb__clear={cb__clear} />
      </div>
    </div>
  )
}

