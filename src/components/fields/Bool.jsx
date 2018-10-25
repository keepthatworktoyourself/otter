import React from 'react';
import Context__PageData from '../Context__PageData';


export default class Bool extends React.Component {

  constructor(props) {
    super(props);
  }


  update(ctx) {
    this.props.field.value = this.input_ref.current.checked;
    ctx.should_update();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    this.input_ref = React.createRef();

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div style={{ display: 'flex' }}>
        <input type="checkbox" ref={this.input_ref} checked={field.value} onChange={_ => this.update.call(this, ctx)} style={{ fontSize: '2rem' }} />
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

