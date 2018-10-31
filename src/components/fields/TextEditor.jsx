import React from 'react';
import ReactQuill from 'react-quill';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';


export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);
  }


  update(ctx, html, _, event_origin) {
    this.props.field.value = html;
    if (event_origin === 'user') {
      ctx.should_update();
    }
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field" key={field.uid}>

          <FieldLabel field={field} block={block} />
          <ReactQuill value={field.value} onChange={(...args) => this.update.call(this, ctx, ...args)} />

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

