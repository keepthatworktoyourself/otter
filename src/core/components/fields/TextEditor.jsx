import React from 'react'
import ReactQuill from 'react-quill'
import Quill from 'quill'
import Icons from '../otter/other/Icons'
import {PageDataContext} from '../../contexts/PageDataContext'
import {ThemeContext} from '../../contexts/ThemeContext'
import {uid} from '../../definitions/utils'
import {classNames} from '../../helpers/style'
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
      const delta = new Delta().insert(node.textContent)
      return node.tagName === 'P' ? delta.insert('\n') : delta
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

    this.uid = uid()
    this.toolbar = `texteditor-toolbar-${this.uid}`
    this.cb__change = this.cb__change.bind(this)
    this.default_headings = [1, 2]
    this.modules = {
      toolbar: {
        container: `#${this.toolbar}`,
        handlers:  {
          hr() {
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
    this.props.parent_block_data[this.props.field_def.name] = html
    if (event_origin === 'user') {
      this.ctx.value_updated()
      this.props.is_display_if_target && this.ctx.redraw()
    }
  }


  render() {
    const field_def            = this.props.field_def
    const parent_block_data = this.props.parent_block_data
    const heading_levels       = field_def.heading_levels || this.default_headings
    const enable_bullets       = field_def.bullets !== false
    const enable_blockquote    = field_def.blockquote
    const enable_hr            = field_def.hr
    const paste_as_plain_text  = field_def.paste_as_plain_text
    const value                = parent_block_data[field_def.name]

    if (paste_as_plain_text) {
      this.modules.clipboard.matchers = [
        [Node.ELEMENT_NODE, cliphandler__clear_formatting()],
      ]
    }

    return (
      <ThemeContext.Consumer>{theme_ctx => (
        <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div>

          <div className={classNames(
            'border-t border-r border-l',
            theme_ctx.classes.skin.border_color,
            theme_ctx.classes.skin.border_radius_default,
            'rounded-b-none',
          )}
          >
            <div className="editor-toolbar"
                 id={this.toolbar}
                 style={{border: 'none'}}
            >
              {heading_levels && heading_levels.length > 0 && (
                <span className="ql-formats">
                  <select className="ql-header">
                    {heading_levels.map((n, i) => <option key={i} value={n}>Heading {n}</option>)}
                    <option value="">Paragraph</option>
                  </select>
                </span>
              )}
              <span className="ql-formats">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
              </span>
              <span className="ql-formats">
                <button className="ql-link"></button>
                {enable_hr && <button className="ql-hr"><Icons.HR /></button>}
              </span>
              {(enable_bullets || enable_blockquote) && (
              <span className="ql-formats">
                {enable_bullets && <button className="ql-list" value="ordered"></button>}
                {enable_bullets && <button className="ql-list" value="bullet"></button>}
                {enable_blockquote && <button className="ql-blockquote"></button>}
              </span>
              )}
              <span className="ql-formats">
                <button className="ql-clean"></button>
              </span>
            </div>
          </div>

          <div className={classNames(
            theme_ctx.classes.skin.text_editor.bg,
            'border',
            theme_ctx.classes.skin.border_color,
            theme_ctx.classes.skin.border_radius_default,
            'rounded-t-none',
          )}
          >
            <ReactQuill defaultValue={value} onChange={this.cb__change} modules={this.modules} theme="snow"
                        parent_uid={this.uid} />
          </div>

        </div>
        )}</PageDataContext.Consumer>
      )}</ThemeContext.Consumer>
    )
  }
}

