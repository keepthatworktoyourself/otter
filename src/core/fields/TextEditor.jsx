import React from 'react'
import ReactQuill from 'react-quill'
import Quill from 'quill'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'
import PageDataContext from '../PageDataContext'
import FieldLabel from '../other/FieldLabel'
import Icons from '../other/Icons'
const Delta = Quill.import('delta')
const BlockEmbed = Quill.import('blots/block/embed')


function cliphandler__clear_formatting() {
  let clear_pastes = false

  setTimeout(function() {
    clear_pastes = true
  }, 1000)
    // This is a nasty workaround for a bug where quill applies clipboard matchers
    // to the initially rendered text

  return function(node, delta) {
    if (clear_pastes) {
      const d = new Delta().insert(node.textContent)
      return node.tagName === 'P' ? d.insert("\n") : d
    }
    else {
      return delta
    }
  }
}


// Horizontal rule
// ---------------------------------

class HRBlot extends BlockEmbed { }
HRBlot.blotName = 'hr'
HRBlot.tagName = 'hr'
Quill.register(HRBlot)


// TextEditor
// ---------------------------------

export default class TextEditor extends React.Component {

  constructor(props) {
    super(props)

    this.uid = Utils.uid()
    this.toolbar = `texteditor-toolbar-${this.uid}`
    this.cb__change = this.cb__change.bind(this)
    this.default_headings = [1, 2]
    this.modules = {
      toolbar: {
        container: `#${this.toolbar}`,
        handlers: {
          hr: function() {
            const cursor_pos = this.quill.getSelection().index
            this.quill.insertText(cursor_pos, '\n', Quill.sources.USER)
            this.quill.insertEmbed(cursor_pos + 1, 'hr', true, Quill.sources.USER)
            this.quill.setSelection(cursor_pos + 2, Quill.sources.SILENT)
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }
  }


  cb__change(html, _, event_origin) {
    this.props.containing_data_item[this.props.field_def.name] = html
    if (event_origin === 'user') {
      this.ctx.value_updated()
      this.props.is_display_if_target && this.ctx.should_redraw()
    }
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const is_top_level         = this.props.is_top_level
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const QuillComponent       = this.props.quill_component || ReactQuill
    const heading_levels       = field_def.heading_levels || this.default_headings
    const blockquote           = field_def.blockquote
    const hr                   = field_def.hr
    const paste_as_plain_text  = field_def.paste_as_plain_text
    const value                = containing_data_item[field_def.name]
    const label                = field_def.description || Utils.humanify_str(field_def.name)

    if (paste_as_plain_text) {
      this.modules.clipboard.matchers = [
        [Node.ELEMENT_NODE, cliphandler__clear_formatting()],
      ]
    }

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`${styles.field}`}>

          <FieldLabel label={label} is_top_level={is_top_level} />

          <div className="editor-toolbar" id={this.toolbar}>
            {heading_levels && heading_levels.length > 0 &&
              <span className="ql-formats">
                <select className="ql-header">
                  {heading_levels.map((n, i) => <option key={i} value={n}>Heading {n}</option>)}
                  <option value="">Paragraph</option>
                </select>
              </span>
            }

            <span className="ql-formats">
              <button className="ql-bold"></button>
              <button className="ql-italic"></button>
              <button className="ql-underline"></button>
            </span>

            <span className="ql-formats">
              <button className="ql-link"></button>
              {hr && <button className="ql-hr"><Icons.HR /></button>}
            </span>

            <span className="ql-formats">
              <button className="ql-list" value="ordered"></button>
              <button className="ql-list" value="bullet"></button>
              {blockquote && <button className="ql-blockquote"></button>}
            </span>

            <span className="ql-formats">
              <button className="ql-clean"></button>
            </span>
          </div>

          <div style={{ backgroundColor: 'white' }}>
            <QuillComponent defaultValue={value} onChange={this.cb__change} modules={this.modules} theme="snow"
                            parent_uid={this.uid} />
          </div>

        </div>
      )}</ContextConsumer>
    )
  }

}

