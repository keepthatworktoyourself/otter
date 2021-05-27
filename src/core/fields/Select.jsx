import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import ClearSelectionBtn from '../other/ClearSelectionBtn';
import Utils from '../definitions/utils';
import styles from '../definitions/styles';


export default class Select extends React.Component {

  constructor(props) {
    super(props);
    this.cb__clear = this.cb__clear.bind(this);
    this.cb__change = this.cb__change.bind(this);
  }


  cb__clear() {
    this.props.containing_data_item[this.props.field_def.name] = null;
    this.setState({});
    this.ctx.value_updated();
    this.ctx.should_redraw();   // For conditional rendering
  }


  cb__change(ev) {
    this.props.containing_data_item[this.props.field_def.name] = ev.target.value;
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
    const value                = containing_data_item[field_def.name];
    const label                = field_def.description || Utils.humanify_str(field_def.name);

    const opts_raw = field_def.options || { };
    const opts     = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { };
    const opt_keys = Object.keys(opts);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`${styles.field}`}>
          <div className="md:flex items-center">

            <div className="mb-2 md:mb-0">
              <FieldLabel label={label}
                          is_top_level={is_top_level}
                          min_width={true} />
            </div>

            <div className="select inline-block mr-3">
              <select className={`
                        appearance-none
                        outline-none
                        ${styles.control_bg} ${styles.control_border} ${styles.button_pad__sm}
                        ${styles.control_border__focus}
                        pr-7
                      `}
                      value={value || ''}
                      onChange={this.cb__change}
              >
                {opt_keys.length === 0 && `[Select field has no options!]`}

                {opt_keys.length !== 0 && [
                  <option disabled key={`f${uid}--disabled`} value="">Select an option</option>,
                  ...opt_keys.map((opt, i) => (
                    <option value={opt} key={`f${uid}--${i}`}>{opts[opt]}</option>
                  )),
                ]}
              </select>
            </div>

            <ClearSelectionBtn cb__clear={this.cb__clear} />
          </div>
        </div>
      )}</ContextConsumer>
    );
  }
}

