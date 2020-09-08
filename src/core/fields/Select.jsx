import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';


export default class Select extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: props.field.value || null };
    this.cb_change = this.cb_change.bind(this);
  }


  cb_change(ev) {
    this.props.field.value = ev.currentTarget.value
    this.setState({ value: ev.currentTarget.value });
    this.ctx.value_updated();
    this.ctx.should_redraw();   // Required for conditional rendering
  }


  render() {
    const field = this.props.field;
    const block = this.props.block;

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

                <div className="select is-small">
                  <select value={field.value || ''} onChange={this.cb_change}>
                    {opt_keys.length === 0 && `[Select field has no options!]`}
                    {opt_keys.map((opt, i) => (
                      <option value={opt} key={`f${field.uid}--${i}`}>{opts[opt]}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }
}

