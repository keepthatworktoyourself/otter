import React from 'react';
import Context__PageData from '../Context__PageData';


export default class TextArea extends React.Component {

  constructor(props) {
    super(props);

    this.textarea_ref = React.createRef();
    this.props.data_channel.handler = this.get_data.bind(this);
  }


  get_data() {
    return this.textarea_ref.current.value;
  }


  render() {
    return (
      <Context__PageData.Consumer>{(ctx) => (
        <textarea ref={this.textarea_ref} value={this.state.value} onChange={ctx.should_update} />
      )}</Context__PageData.Consumer>
    );
  }

}