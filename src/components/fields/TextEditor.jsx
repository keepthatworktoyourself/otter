import React from 'react';
import ReactQuill from 'react-quill';
import Context__PageData from '../Context__PageData';


export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.cb_change = this.cb_change.bind(this);
    this.state = { html: '' };
    this.props.data_channel.handler = this.get_data.bind(this);
  }


  get_data() {
    return this.state.html;
  }


  cb_change(ctx, html, _, event_origin) {
    this.state.html = html;
    if (event_origin === 'user') {
      ctx.should_update();
    }
  }


  render() {
    const field = this.props.field;
    const field_def = this.props.field_definition;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <ReactQuill value={field} onChange={(...args) => this.cb_change(ctx, ...args)} />
      )}</Context__PageData.Consumer>
    );
  }

}

