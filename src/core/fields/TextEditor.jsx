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
    this.props.containing_data_item[this.props.field_def.name] = html;
    if (event_origin === 'user') {
      this.ctx.value_updated();
    }
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const value                = containing_data_item[field_def.name];

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">

          <FieldLabel label={field_def.description || field_def.name} is_top_level={is_top_level} />

          <div style={{ backgroundColor: 'white' }}>
            <ReactQuill defaultValue={value} onChange={this.cb_change} modules={this.modules} theme="snow" />
          </div>

        </div>
      )}</ContextConsumer>
    );
  }

}

