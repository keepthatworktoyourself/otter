import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Radios extends React.Component {

  constructor(props) {
    super(props);

    this.uid      = Utils.uid();
    this.cb_click = this.cb_click.bind(this);
    this.cb_clear = this.cb_clear.bind(this);
  }


  cb_click(ev) {
    const input = ev.currentTarget.querySelector('input');
    this.props.containing_data_item[this.props.field_def.name] = input.value;
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // Required for conditional rendering
  }


  cb_clear(ev) {
    this.props.containing_data_item[this.props.field_def.name] = null;
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // Required for conditional rendering
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const input_name           = `radios-${this.uid}`;
    const value                = containing_data_item[field_def.name];

    const opts_raw = field_def.options || { };
    const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { };
    const opt_keys = Object.keys(opts);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel label={field_def.description || field_def.name} is_top_level={is_top_level}
                          colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div style={{ paddingRight: '0.5rem' }}>
                <div className="buttons has-addons is-marginless">
                  {opt_keys.length === 0 && `[Radio field has no options!]`}
                  {opt_keys.map((opt, i) => {
                    const input_id = `${input_name}--${i}`;
                    const active = opt === value ? 'is-selected is-link' : '';
                    const sel = { checked: opt === value };

                    return (
                      <a className={`radio-option button is-small ${active}`} data-value={opt}
                        style={{ marginBottom: 0 }} onClick={this.cb_click} key={input_id}>

                        {opts[opt]}

                        <input type="radio" readOnly name={input_name} id={input_id} {...sel}
                               value={opt} style={{ display: 'none' }} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {opt_keys.length > 0 && (
                <div>
                  <a className="radio-clear-btn button is-rounded is-small is-light has-text-grey-light"
                     onClick={this.cb_clear}>
                    <FontAwesomeIcon icon={faTimes} />
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}</ContextConsumer>
    );
  }
}

