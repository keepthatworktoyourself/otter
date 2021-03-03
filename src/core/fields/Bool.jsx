import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';


export default class Bool extends React.Component {

  constructor(props) {
    super(props);
    this.cb_click = this.cb_click.bind(this);
  }


  cb_click(ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      this.props.containing_data_item[this.props.field_def.name] = true;
    }
    else {
      this.props.containing_data_item[this.props.field_def.name] = false;
    }

    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // Required for conditional rendering
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const yes_label            = field_def.yes_label || 'Yes';
    const no_label             = field_def.no_label  || 'No';
    const value                = containing_data_item[field_def.name];
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel label={field_def.description || field_def.name} is_top_level={is_top_level}
                          align="left" colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div className="buttons has-addons is-marginless">
                <a className={`button is-small ${value && 'is-selected is-link'}`} data-value="yes"
                   style={{ marginBottom: 0 }} onClick={this.cb_click}>
                  {yes_label}
                </a>
                <a className={`button is-small ${!value && 'is-selected is-link'}`} data-value="no"
                   style={{ marginBottom: 0 }} onClick={this.cb_click}>
                  {no_label}
                </a>
              </div>
            </div>

            <input type="checkbox" readOnly checked={value || false} style={{ display: 'none' }} />

          </div>
        </div>
      )}</ContextConsumer>
    );
  }

}

