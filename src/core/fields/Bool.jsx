import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from './FieldLabel';


export default class Bool extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: props.field.value || false };
    this.cb_click = this.cb_click.bind(this);
  }


  cb_click(ev) {
    if (ev.currentTarget.getAttribute('data-value') === 'yes') {
      this.props.field.value = true;
    }
    else {
      this.props.field.value = false;
    }

    this.setState({ value: this.props.field.value });
    this.ctx.should_update();
  }


  render() {
    const field = this.props.field;
    const block = this.props.block;
    const text__yes = this.props.field.def.text__yes || 'Yes';
    const text__no  = this.props.field.def.text__no || 'No';

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div className="is-flex-tablet" style={{ alignItems: 'center' }}>

            <div className="c-label-margin-btm-phone">
              <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
            </div>

            <div className="is-flex" style={{ alignItems: 'center' }}>
              <div className="buttons has-addons is-marginless">
                <a className={`button is-small ${field.value === true && 'is-selected is-link'}`} data-value="yes" style={{ marginBottom: 0 }} onClick={this.cb_click}>
                  {text__yes}
                </a>
                <a className={`button is-small ${field.value === false && 'is-selected is-link'}`} data-value="no" style={{ marginBottom: 0 }} onClick={this.cb_click}>
                  {text__no}
                </a>
              </div>
            </div>

            <input type="checkbox" readOnly checked={this.state.value} style={{ display: 'none' }} />

          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

