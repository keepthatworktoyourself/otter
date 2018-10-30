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
    const block = this.props.block;
    const field = this.props.field;
    const text__yes = this.props.field.def.text__yes || 'Yes';
    const text__no  = this.props.field.def.text__no || 'No';

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field" key={field.uid}>
          <div class="level">
            <div class="level-left">

              <div class="level-item">
                <FieldLabel field={field} align='left' />
              </div>

              <div class="level-item">
                <div className="tabs is-toggle is-small">
                  <ul>
                    <li className={field.value === true ? 'is-active' : ''}>
                      <a onClick={ev => this.cb_click.call(this, ctx, ev)} data-value="yes">{text__yes}</a>
                    </li>
                    <li className={field.value === false ? 'is-active' : ''}>
                      <a onClick={ev => this.cb_click.call(this, ctx, ev)} data-value="no">{text__no}</a>
                    </li>
                  </ul>
                </div>
              </div>

              <input type="checkbox" checked={field.value} style={{ display: 'none' }} />

            </div>
          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

