import React from 'react';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';
import {rnd_str} from '../../utils';


export default class Bool extends React.Component {

  constructor(props) {
    super(props);
  }


  cb_click(ctx, ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      this.props.field.value = true;
    }
    else {
      this.props.field.value = false;
    }

    ctx.should_update();
  }


  render() {
    const field = this.props.field;
    const block = this.props.block;
    const text__yes = this.props.field.def.text__yes || 'Yes';
    const text__no  = this.props.field.def.text__no || 'No';

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div className="buttons has-addons is-marginless">
                <a className={`button is-small ${field.value === true && 'is-selected is-link'}`} data-value="yes" style={{ marginBottom: 0 }} onClick={ev => this.cb_click.call(this, ctx, ev)}>
                  {text__yes}
                </a>
                <a className={`button is-small ${field.value !== true && 'is-selected is-link'}`} data-value="no" style={{ marginBottom: 0 }} onClick={ev => this.cb_click.call(this, ctx, ev)}>
                  {text__no}
                </a>
              </div>
            </div>

            <input type="checkbox" checked={field.value} style={{ display: 'none' }} />

          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

