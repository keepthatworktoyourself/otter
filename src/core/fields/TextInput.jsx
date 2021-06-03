import React from 'react'
import PageDataContext from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'


export default class TextInput extends React.Component {

  constructor(props) {
    super(props)
    this.cb__change = this.cb__change.bind(this)
  }


  cb__change(ev) {
    this.props.containing_data_item[this.props.field_def.name] = ev.target.value
    this.setState({})
    this.ctx.value_updated()
    this.props.is_display_if_target && this.ctx.should_redraw()
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const is_top_level         = this.props.is_top_level
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const value                = containing_data_item[field_def.name] || ''
    const label                = field_def.description || Utils.humanify_str(field_def.name)

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`${styles.field}`}>
          <FieldLabel label={label} is_top_level={is_top_level} />

          <input type="text" className={`
                   w-full
                   outline-none rounded
                   ${styles.button_pad} ${styles.control_bg} ${styles.control_border}
                   ${styles.control_border__focus}
                 `}
                 value={value}
                 onChange={this.cb__change} />
        </div>
      )}</ContextConsumer>
    )
  }

}

