import React from 'react'
import Toggle from 'react-toggle'
import PageDataContext from './PageDataContext'
import Utils from './definitions/utils'
import DDToggle from './other/DDToggle'
import styles from './definitions/styles'


export default class NestedBlockWrapper extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
    this.cb__toggle_enabled   = this.cb__toggle_enabled.bind(this)
    this.cb__toggle_collapse  = this.cb__toggle_collapse.bind(this)
  }


  cb__toggle_enabled(ev) {
    ev.currentTarget.blur()

    if (this.props.field_def.optional) {
      Utils.optional_nested_block__set_enabled(
        this.props.field_def.name,
        this.props.containing_data_item,
        ev.currentTarget.checked
      )
    }

    if (!ev.currentTarget.checked) {
      this.setState({
        collapsed: false,
      })
    }

    this.ctx.value_updated()
    this.ctx.should_redraw()
    this.ctx.block_toggled()
  }


  cb__toggle_collapse(ev) {
    const is_enabled = (
      !this.props.field_def.optional ||
      Utils.optional_nested_block__is_enabled(this.props.field_def.name, this.props.containing_data_item)
    )

    if (is_enabled) {
      this.setState({
        collapsed: !this.state.collapsed,
      })
      this.ctx.should_redraw()
      this.ctx.block_toggled()
    }
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const title                = field_def.description || Utils.humanify_str(field_def.name)
    const is_optional          = field_def.optional
    const is_enabled           = !is_optional || Utils.optional_nested_block__is_enabled(field_def.name, containing_data_item)

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div>

          <div>
            <h4 className="pb-2 cursor-pointer font-semibold">
              <span className="nbw-toggle inline-block" onClick={this.cb__toggle_collapse} >
                {title}
                {is_enabled && <DDToggle is_open={!this.state.collapsed} cb={this.cb__toggle_collapse} />}
              </span>

              {is_optional && (
                <span className="relative pl-2 top-px">
                  <Toggle checked={is_enabled} icons={false} onChange={this.cb__toggle_enabled} />
                </span>
              )}
            </h4>
          </div>

          {is_enabled && !this.state.collapsed && (
            <div className="pb-2">
              <div className={`${styles.nested_block} ${styles.control_bg} p-4 pb-0`}>
                {this.props.children}
              </div>
            </div>
          )}

        </div>
      )}</ContextConsumer>
    )
  }

}

