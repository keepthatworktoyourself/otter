import React from 'react';
import Context__PageData from '../Context__PageData';
import {rnd_str} from '../../utils';


export default class Select extends React.Component {

  constructor(props) {
    super(props);
  }


  update(ctx) {
    const selected = this.refs.map(r => r.current).filter(el => el.checked);
    this.props.field.value = selected.length === 1 ? selected[0].value : null;

    ctx.should_update();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;
    const input_name = 'radios-' + rnd_str(8);
    const radio_opts = Object.keys(field.def.options);

    this.refs = radio_opts.map(_ => React.createRef());

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div style={{ display: 'flex' }}>
          {radio_opts.map((opt, i) => {
            const input_id = `${input_name}-input-${i}`;
            const sel = { checked: opt === field.value };
            const ref = this.refs[i];

            return (
              <div style={{ marginRight: '1rem' }}>
                <input type="radio" ref={ref} name={input_name} id={input_id} value={opt} {...sel} onChange={_ => this.update.call(this, ctx)} style={{ marginRight: '0.5rem' }}/>
                <label htmlFor={input_id}>{field.def.options[opt]}</label>
              </div>
            );
          })}
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

