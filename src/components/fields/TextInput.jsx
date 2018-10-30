import React from 'react';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';


export default class TextInput extends React.Component {

  constructor(props) {
    super(props);
  }


  update(ctx) {
    this.props.field.value = this.input_ref.current.value;
    ctx.should_update();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    this.input_ref = React.createRef();
    const value = Object.assign({ }, field.value ? { value: field.value } : { });

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field" key={field.uid}>

          <FieldLabel field={field} />
          <div class="control">
            <input type="text" className="input" ref={this.input_ref} {...value} onChange={_ => this.update.call(this, ctx)} />
          </div>

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

