import React from 'react';
import Context__PageData from '../Context__PageData';


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

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div>
          <input type="text" ref={this.input_ref} value={field.value} onChange={_ => this.update.call(this, ctx)} />
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

