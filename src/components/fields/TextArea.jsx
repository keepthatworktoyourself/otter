import React from 'react';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';


export default class TextArea extends React.Component {

  constructor(props) {
    super(props);
  }


  update() {
    this.props.field.value = this.textarea_ref.current.value;
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    this.textarea_ref = React.createRef();

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field">

          <FieldLabel field={field} />
          <textarea className="textarea" ref={this.textarea_ref} value={field.value} onChange={_ => this.update.call(this, ctx)} />

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

