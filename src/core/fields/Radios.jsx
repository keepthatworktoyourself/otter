import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Select extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: props.field.value || null };
    this.cb_click = this.cb_click.bind(this);
    this.cb_clear = this.cb_clear.bind(this);
  }


  cb_click(ev) {
    const input = ev.currentTarget.querySelector('input');
    this.props.field.value = input.value;
    this.setState({ value: input.value });
    this.ctx.should_update();
  }


  cb_clear(ev) {
    this.props.field.value = null;
    this.setState({ value: null });
    this.ctx.should_update();
  }


  render() {
    const field = this.props.field;
    const block = this.props.block;
    const input_name = `radios-${Utils.rnd_str(6)}`;

    const opts_raw = field.def.options || { };
    const opts = (opts_raw.constructor === Function ? opts_raw() : opts_raw) || { };
    const opt_keys = Object.keys(opts);

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div style={{ paddingRight: '0.5rem' }}>
                <div className="buttons has-addons is-marginless">
                  {opt_keys.length === 0 && `[Radio field has no options!]`}
                  {opt_keys.map((opt, i) => {
                    const input_id = `${input_name}-input-${i}`;
                    const active = opt === field.value ? 'is-selected is-link' : '';
                    const sel = { checked: opt === field.value };

                    return (
                      <a className={`button is-small ${active}`} style={{ marginBottom: 0 }} onClick={this.cb_click} key={input_id}>
                        {opts[opt]}
                        <input type="radio" readOnly name={input_name} id={input_id} {...sel} value={opt} style={{ display: 'none' }} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {opt_keys.length > 0 && (
                <div>
                  <a className="button is-rounded is-small is-light has-text-grey-light" onClick={this.cb_clear}>
                    <FontAwesomeIcon icon={faTimes} />
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }
}

