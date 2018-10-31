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
    const field = this.props.field;
    const block = this.props.block;

    this.textarea_ref = React.createRef();

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field">

          <FieldLabel field={field} block={block} />
          <textarea className="textarea" ref={this.textarea_ref} value={field.value} onChange={_ => this.update.call(this, ctx)} />

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

