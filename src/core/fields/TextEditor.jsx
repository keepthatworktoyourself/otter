import React from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';


function cliphandler__clear_formatting() {
  const Delta = Quill.import('delta');
  let clear_pastes = false;

  setTimeout(function() {
    clear_pastes = true;
  }, 1000);
    // This is a nasty workaround for a bug where quill applies clipboard matchers
    // to the initially rendered text

  return function(node, delta) {
    if (clear_pastes) {
      const d = new Delta().insert(node.textContent);
      return node.tagName === 'P' ? d.insert("\n") : d;
    }
    else {
      return delta;
    }
  };
}


export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.cb_change = this.cb_change.bind(this);
    this.default_headers = [1, 2, false];
    this.modules = {
      toolbar: [
        [{ header: this.default_headers }],
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
    const heading_levels       = field_def.heading_levels;
    const blockquote           = field_def.blockquote;
    const paste_as_plain_text  = field_def.paste_as_plain_text;
    const value                = containing_data_item[field_def.name];


    if (paste_as_plain_text) {
      this.modules.clipboard = this.modules.clipboard || {
        matchers: [
          [Node.ELEMENT_NODE, cliphandler__clear_formatting()],
        ],
      };
    }

    if (heading_levels) {
      this.modules.toolbar[0] = [{
         header: [...heading_levels, false],
      }];
    }

    if (blockquote) {
      this.modules.toolbar.splice(
        this.modules.toolbar.length - 2,
        0,
        ['blockquote'],
      );
    }

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

