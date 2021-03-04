import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';


export default class Select extends React.Component {

  constructor(props) {
    super(props);
    this.cb_change = this.cb_change.bind(this);
  }


  cb_change(ev) {
    this.props.containing_data_item[this.props.field_def.name] = ev.target.value;
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // Required for conditional rendering
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const uid                  = `${containing_data_item.__uid}-${field_def.name}`;
    const value                = containing_data_item[field_def.name];
    const label                = field_def.description || Utils.humanify_str(field_def.name);

    const opts_raw = field_def.options || { };
    const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { };
    const opt_keys = Object.keys(opts);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel label={label} is_top_level={is_top_level}
                          colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div style={{ paddingRight: '0.5rem' }}>

                <div className="select is-small">
                  <select value={value || ''} onChange={this.cb_change}>

                    {opt_keys.length === 0 && `[Select field has no options!]`}

                    {opt_keys.length !== 0 && [
                      <option disabled key={`f${uid}--disabled`} value="">Select an option</option>,
                      ...opt_keys.map((opt, i) => (
                        <option value={opt} key={`f${uid}--${i}`}>{opts[opt]}</option>
                      )),
                    ]}

                  </select>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}</ContextConsumer>
    );
  }
}

