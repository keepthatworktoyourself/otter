import React from 'react';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {rnd_str} from '../../utils';


export default class Select extends React.Component {

  constructor(props) {
    super(props);
  }


  cb_click(ctx, ev) {
    const input = ev.currentTarget.querySelector('input');
    this.props.field.value = input.value;

    ctx.should_update();
  }


  cb_clear(ctx) {
    this.props.field.value = null;
    ctx.should_update();
  }


  render() {
    const field = this.props.field;
    const block = this.props.block;
    const input_name = 'radios-' + rnd_str(6);
    const radio_opts = Object.keys(field.def.options);

    this.refs = radio_opts.map(_ => React.createRef());

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div style={{ paddingRight: '0.5rem' }}>
                <div className="buttons has-addons is-marginless">
                  {radio_opts.map((opt, i) => {
                    const input_id = `${input_name}-input-${i}`;
                    const active = opt === field.value ? 'is-selected is-link' : '';
                    const sel = { checked: opt === field.value };
                    const ref = this.refs[i];

                    return (
                      <a className={`button is-small ${active}`} style={{ marginBottom: 0 }} onClick={ev => this.cb_click.call(this, ctx, ev)}>
                        {field.def.options[opt]}
                        <input type="radio" ref={ref} name={input_name} id={input_id} {...sel} value={opt} style={{ display: 'none' }} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <a className="button is-rounded is-small is-light has-text-grey-light" onClick={_ => this.cb_clear.call(this, ctx)}>
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

