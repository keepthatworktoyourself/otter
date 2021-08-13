import React from 'react'
import PageDataContext from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import ClearSelectionBtn from '../other/ClearSelectionBtn'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'


export default class Radios extends React.Component {

  constructor(props) {
    super(props)
    this.cb__click = this.cb__click.bind(this)
    this.cb__clear = this.cb__clear.bind(this)
  }


  cb__click(ev) {
    const input = ev.currentTarget.querySelector('input')
    this.props.containing_data_item[this.props.field_def.name] = input.value
    this.setState({})
    this.ctx.value_updated()
    this.ctx.should_redraw()   // For conditional rendering
  }


  cb__clear(ev) {
    delete this.props.containing_data_item[this.props.field_def.name]
    this.setState({})
    this.ctx.value_updated()
    this.ctx.should_redraw()   // For conditional rendering
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const is_top_level         = this.props.is_top_level
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const swatches             = field_def.swatches
    const uid                  = `${containing_data_item.__uid}-${field_def.name}`
    const input_name           = `radios-${uid}`
    const value                = containing_data_item[field_def.name] || ''
    const label                = field_def.description || Utils.humanify_str(field_def.name)

    const opts_raw = field_def.options || { }
    const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { }
    const opt_keys = Object.keys(opts)

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
      ${selected ? 'scale-125 z-10' : ''}
    `

    const styles__swatch = (selected, opt) => ({
      backgroundColor: opts[opt],
    })

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
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
                const selected = opt === value
                const sel = { checked: selected }
                const classes = swatches ? btn_classes__swatch(selected) : btn_classes(selected)
                const styles = swatches ? styles__swatch(selected, opt) : { }

                return (
                  <a className={`${classes} mb-0`}
                     data-value={opt}
                     onClick={this.cb__click}
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

            {opt_keys.length > 0 && <ClearSelectionBtn cb__clear={this.cb__clear} />}

          </div>
        </div>
      )}</ContextConsumer>
    )
  }
}

