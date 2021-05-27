import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';
import styles from '../definitions/styles';


export default class Radios extends React.Component {

  constructor(props) {
    super(props);

    this.cb_click = this.cb_click.bind(this);
    this.cb_clear = this.cb_clear.bind(this);
  }


  cb_click(ev) {
    const input = ev.currentTarget.querySelector('input');
    this.props.containing_data_item[this.props.field_def.name] = input.value;
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // For conditional rendering
  }


  cb_clear(ev) {
    delete this.props.containing_data_item[this.props.field_def.name];
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // For conditional rendering
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const uid                  = `${containing_data_item.__uid}-${field_def.name}`;
    const input_name           = `radios-${uid}`;
    const value                = containing_data_item[field_def.name] || '';
    const label                = field_def.description || Utils.humanify_str(field_def.name);

    const opts_raw = field_def.options || { };
    const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { };
    const opt_keys = Object.keys(opts);

    const btn_styles = (selected) => `
      inline-block
      border-r
      ${styles.button_bg_hover} ${styles.button_bg_active}
      ${styles.button_pad_sm}
      ${selected && 'bg-gray-400'}
    `;

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`${styles.field}`}>
          <div className="flex flex-wrap items-center">

            <div className="mb-2 md:mb-0 w-full md:w-auto">
              <FieldLabel label={label}
                          is_top_level={is_top_level}
                          min_width={true} />
            </div>

            <div className={`{styles.button_bg} ${styles.button} ${styles.button_dark_border_static} overflow-hidden`}>
              {opt_keys.length === 0 && `[Radio field has no options!]`}
              {opt_keys.map((opt, i) => {
                const input_id = `${input_name}--${i}`;
                const selected = opt === value;
                const sel = { checked: selected };

                return (
                  <a className={`${btn_styles(selected)} mb-0`}
                     data-value={opt}
                     onClick={this.cb_click}
                     key={input_id}
                  >
                    {opts[opt]}

                    <input type="radio" readOnly name={input_name} id={input_id} {...sel}
                           value={opt} className="hidden" />
                  </a>
                );
              })}
            </div>

            {opt_keys.length > 0 && (
              <div className="inline-block md:block ml-3">
                <a className="cursor-pointer text-gray-600 hover:text-gray-400" onClick={this.cb_clear}>
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>
            )}

          </div>
        </div>
      )}</ContextConsumer>
    );
  }
}

