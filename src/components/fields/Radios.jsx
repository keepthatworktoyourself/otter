import React from 'react';
import Context__PageData from '../Context__PageData';
import {rnd_str} from '../../utils';


export default class Select extends React.Component {

  constructor(props) {
    super(props);

    this.props.data_channel.handler = this.get_data.bind(this);
  }


  get_data() {
    const selected = this.refs.map(r => r.current).filter(el => el.checked);
    return selected.length === 1 ? selected[0].value : null;
  }


  render() {
    const field = this.props.field;
    const field_def = this.props.field_definition;
    const input_set_name = 'radios-' + rnd_str(8);
    this.refs = Object.keys(field_def.options).map(_ => React.createRef());

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div>
          {Object.keys(field_def.options).map((opt, i) => {
            const input_id = `${input_set_name}-input-${i}`;
            const sel = { checked: opt === field };
            const ref = this.refs[i];

            return (
              <div style={{ display: 'inlineBlock', marginRight: '1rem' }}>
                <input type="radio" ref={ref} name={input_set_name} id={input_id} value={opt} {...sel} onChange={ctx.should_update} />
                <label htmlFor={input_id}>{field_def.options[opt]}</label>
              </div>
            );
          })}
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

