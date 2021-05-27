import React from 'react'
import PageDataContext from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'


export default class Bool extends React.Component {

  constructor(props) {
    super(props)
    this.cb__click = this.cb__click.bind(this)
  }


  cb__click(ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      this.props.containing_data_item[this.props.field_def.name] = true
    }
    else {
      this.props.containing_data_item[this.props.field_def.name] = false
    }

    this.setState({})
    this.ctx.value_updated()
    this.ctx.should_redraw()   // For conditional rendering
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const is_top_level         = this.props.is_top_level
    const yes_label            = field_def.yes_label   || 'Yes'
    const no_label             = field_def.no_label    || 'No'
    const label                = field_def.description || Utils.humanify_str(field_def.name)
    const value                = containing_data_item[field_def.name]
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer

  const btn_styles = (selected, last) => `
    inline-block
    ${!last ? 'border-r' : ''}
    ${selected ? 'bg-gray-600' : styles.control_bg}
    ${selected ? 'text-gray-50' : ''}
    ${selected ? 'font-semibold' : ''}
    ${styles.button_pad__sm}
  `

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`${styles.field}`}>
          <div className="md:flex items-center">

            <div className="mb-2 md:mb-0">
              <FieldLabel label={label}
                          is_top_level={is_top_level}
                          min_width={true} />
            </div>

            <div className={`inline-block md:block ${styles.control_border} ${styles.button} overflow-hidden`}>
              <a className={btn_styles(value)}
                 data-value="yes"
                 onClick={this.cb__click}
              >
                {yes_label}
              </a>

              <a className={btn_styles(!value, true)}
                 data-value="no"
                 onClick={this.cb__click}
              >
                {no_label}
              </a>
            </div>

            <input className="hidden" type="checkbox" readOnly checked={value || false} />
          </div>
        </div>
      )}</ContextConsumer>
    )
  }

}

