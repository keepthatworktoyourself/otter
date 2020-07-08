import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from './FieldLabel';


export default class TextArea extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: props.field.value || '' };
    this.cb_change = this.cb_change.bind(this);
    this.textarea_ref = React.createRef();
  }

  cb_change() {
    this.props.field.value = this.textarea_ref.current.value;
    this.setState({ value: this.textarea_ref.current.value });
    this.ctx.should_update();
  }


  render() {
    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="field">

          <FieldLabel field={this.props.field} block={this.props.block} />
          <textarea className="textarea" ref={this.textarea_ref} value={this.props.field.value || ''} onChange={this.cb_change} />

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

