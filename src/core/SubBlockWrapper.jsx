import React from 'react';
import PageDataContext from './PageDataContext';
import Utils from './definitions/utils';
import DDToggle from './other/DDToggle';
import Toggle from 'react-toggle';


export default class SubBlockWrapper extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };
    this.cb__toggle_enabled   = this.cb__toggle_enabled.bind(this);
    this.cb__toggle_collapse  = this.cb__toggle_collapse.bind(this);
  }


  cb__toggle_enabled(ev) {
    ev.currentTarget.blur();

    if (this.props.field_def.optional) {
      Utils.optional_subblock__set_enabled(
        this.props.field_def.name,
        this.props.containing_data_item,
        ev.currentTarget.checked
      );
    }

    if (!ev.currentTarget.checked) {
      this.setState({
        collapsed: false,
      });
    }

    this.ctx.value_updated();
    this.ctx.should_redraw();
    this.ctx.block_toggled();
  }


  cb__toggle_collapse(ev) {
    const is_enabled = (
      !this.props.field_def.optional ||
      Utils.optional_subblock__is_enabled(this.props.field_def.name, this.props.containing_data_item)
    );

    if (is_enabled) {
      this.setState({
        collapsed: !this.state.collapsed,
      });
      this.ctx.should_redraw();
      this.ctx.block_toggled();
    }
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const title                = field_def.description || field_def.name;
    const is_optional          = field_def.optional;
    const is_enabled           = !is_optional || Utils.optional_subblock__is_enabled(field_def.name, containing_data_item);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="subblock-wrapper">

          <div>
            <h4 style={{ paddingBottom: '0.5rem' }} className="is-clickable title is-7 is-marginless">
              <span onClick={this.cb__toggle_collapse} className="subblock-wrapper-toggle is-inline-block">
                {title}

                {is_enabled && <DDToggle is_open={!this.state.collapsed} cb={this.cb__toggle_collapse} />}
              </span>

              {is_optional && (
                <span style={{ paddingLeft: '0.3rem', position: 'relative', top: '1px' }}>
                  <Toggle checked={is_enabled} icons={false} onChange={this.cb__toggle_enabled} />
                </span>
              )}
            </h4>
          </div>

          {is_enabled && !this.state.collapsed && (
            <div style={{ paddingBottom: '0.5rem' }}>
              <div className={`otter-box otter-box--bordered`} style={{ padding: '1rem' }}>
                {this.props.children}
              </div>
            </div>
          )}

        </div>
      )}</ContextConsumer>
    );
  }

};

