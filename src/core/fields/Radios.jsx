import React from 'react'
import {usePageData} from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import ClearSelectionBtn from '../other/ClearSelectionBtn'
import {humanify_str, evaluate} from '../definitions/utils'
import styles from '../definitions/styles'

export default function Radios(props) {
  const ctx                  = usePageData()
  const field_def            = props.field_def
  const containing_data_item = props.containing_data_item
  const is_top_level         = props.is_top_level
  const swatches             = field_def.swatches
  const uid                  = `${containing_data_item.__uid}-${field_def.name}`
  const input_name           = `radios-${uid}`
  const value                = containing_data_item[field_def.name]
  const label                = field_def.description || humanify_str(field_def.name)
  const opts_raw      = field_def.options || { }
  const opts          = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
  const opt_keys      = Object.keys(opts)
  const default_value = evaluate(field_def.default_value)
  const display_value = (value === undefined ? default_value : value) || ''

  function cb__click(ev) {
    const input = ev.currentTarget.querySelector('input')
    containing_data_item[field_def.name] = input.value
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  function cb__clear(ev) {
    containing_data_item[field_def.name] = null
    ctx.value_updated()
    ctx.redraw()   // For conditional rendering
  }

  const btn_classes = (selected) => `
    inline-block mr-1
    ${styles.button} ${styles.control_border} ${styles.control_border__interactive}
    ${selected ? 'bg-gray-600' : styles.control_bg}
    ${selected ? 'text-gray-50' : ''}
    ${selected ? 'font-semibold' : ''}
    ${styles.button_pad__sm}
  `
  const btn_classes__swatch = (selected) => `
    inline-block mr-1 w-7
    ${styles.button} ${styles.button_pad__sm} ${styles.control_border}
    transform transition-transform
    ${selected ? 'scale-125 z-2' : ''}
  `

  const styles__swatch = (selected, opt) => ({
    backgroundColor: opts[opt],
  })

  return (
    <div className={`${styles.field}`}>
      <div className="flex flex-wrap items-center">

        <div className="mb-2 md:mb-0 w-full md:w-auto">
          <FieldLabel label={label}
                      is_top_level={is_top_level}
                      min_width={true} />
        </div>

        <div className={`otter-radios inline-block md:block mr-2`}>
          {opt_keys.length === 0 && `[Radio field has no options!]`}
          {opt_keys.map((opt, i) => {
            const input_id = `${input_name}--${i}`
            const selected = opt === display_value
            const sel = { checked: selected }
            const classes = swatches ? btn_classes__swatch(selected) : btn_classes(selected)
            const styles = swatches ? styles__swatch(selected, opt) : { }

            return (
              <a className={`${classes} mb-0`}
                 data-value={opt}
                 onClick={cb__click}
                 key={input_id}
                 style={styles}
              >
                 {swatches ? ' ' : opts[opt]}
                <input type="radio" readOnly name={input_name} id={input_id} {...sel}
                       value={opt} className="hidden" />
              </a>
            )
          })}
        </div>

        {opt_keys.length > 0 && <ClearSelectionBtn cb__clear={cb__clear} />}

      </div>
    </div>
  )
}

