import React from 'react';
import ReactQuill from 'react-quill';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';


export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    this.cb_change = this.cb_change.bind(this);
    this.modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'link'],
        [{ list: 'ordered'}, {list: 'bullet'}],
        ['clean'],
      ],
    };
  }


  cb_change(html, _, event_origin) {
    this.props.field.value = html;
    if (event_origin === 'user') {
      this.ctx.value_updated();
    }
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="field" key={field.uid}>

          <FieldLabel field={field} block={block} />
          <div style={{ backgroundColor: 'white' }}>
            <ReactQuill defaultValue={field.value} onChange={this.cb_change} modules={this.modules} theme="snow" />
          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

