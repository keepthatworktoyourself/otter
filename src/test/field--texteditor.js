import test from 'ava'
import React from 'react'
import ReactQuill from 'react-quill'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as DnD from 'react-beautiful-dnd'
import RecursiveBlockRenderer from '../core/RecursiveBlockRenderer'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({ adapter: new Adapter() })


const field = {
  name:        'content',
  description: 'Richer text',
  type:        Otter.Fields.TextEditor,
}
const data_item = {
  __type: 'X',
  content: '<h1>Important message</h1><p>Hi there</p>',
}


function same(a1, a2) {
  return a1.length === a2.length && a1.reduce((carry, item, i) => {
    return carry && item === a2[i]
  }, true)
}


const QuillStub = stubs.mk_stub('QuillStub')


function mk(field_def, containing_data_item, ctx_methods, is_top_level) {
  return mount(<Otter.Fields.components.TextEditor field_def={field_def}
                                                   containing_data_item={containing_data_item}
                                                   consumer_component={stubs.func_stub([{...ctx_methods}])}
                                                   quill_component={QuillStub}
                                                   is_top_level={is_top_level} />)
}


test('TextEditor: renders quill editor, contains initial value', t => {
  const wrapper = mk(field, data_item, {}, true)
  const quill = wrapper.find('[type="QuillStub"]')
  t.is(1, quill.length)
  t.is(data_item.content, quill.props().defaultValue)
})


test('TextEditor: value change updates state, calls ctx value_updated only', t => {
  const ctx = {
    value_updated() { ctx.value_updated.called = true },
    redraw() { ctx.redraw.called = true },
  }
  const d = Otter.Utils.copy(data_item)

  const wrapper = mk(field, d, ctx)
  const quill = wrapper.find('[type="QuillStub"]')
  const new_html_value = '<h2>Some wealthy text</h2>'

  quill.prop('onChange')(new_html_value, null, 'user')
  t.is(true,      ctx.value_updated.called)
  t.is(undefined, ctx.redraw.called)
  t.is(new_html_value, d.content)
})


test('TextEditor: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk(field, data_item, {}, true)
  const wrapper__nested = mk(field, data_item, {}, false)

  const lbl__top    = wrapper__top.find('FieldLabel')
  const lbl__nested = wrapper__nested.find('FieldLabel')

  t.is(1, lbl__top.length)
  t.is(1, lbl__nested.length)
  t.is('Richer text', lbl__top.get(0).props.label)
  t.is(true,  lbl__top.get(0).props.is_top_level)
  t.is(false, lbl__nested.get(0).props.is_top_level)
})


test('TextEditor: paste_as_plain_text sets clipboard matcher', t => {
  const f = Object.assign({}, field, { paste_as_plain_text: true })
  const wrapper = mk(f, data_item, {}, true)
  const matchers = wrapper.instance().modules.clipboard.matchers
  t.is(Node.ELEMENT_NODE, matchers[0][0])
  t.is('function', typeof wrapper.instance().modules.clipboard.matchers[0][1])
})


test('TextEditor: heading_levels overrides toolbar opts', t => {
  const f = Object.assign({}, field, { heading_levels: [3, 4] })
  const wrapper__default         = mk(field, data_item, {}, true)
  const wrapper__custom_headings = mk(f,     data_item, {}, true)
  const tb_default         = wrapper__default.find('.editor-toolbar')
  const tb_custom_headings = wrapper__custom_headings.find('.editor-toolbar')
  const levels__default          = tb_default.find('.ql-header option').map(el => [el.props().value, el.text()])
  const levels__custom_headings  = tb_custom_headings.find('.ql-header option').map(el => [el.props().value, el.text()])

  t.deepEqual([[1, 'Heading 1'], [2, 'Heading 2'], ['', 'Paragraph']], levels__default)
  t.deepEqual([[3, 'Heading 3'], [4, 'Heading 4'], ['', 'Paragraph']], levels__custom_headings)
})


test('TextEditor: blockquote enables blockquote', t => {
  const f = Object.assign({}, field, { blockquote: true })
  const wrapper__default    = mk(field, data_item, {}, true)
  const wrapper__blockquote = mk(f,     data_item, {}, true)

  t.is(0, wrapper__default.find('.ql-blockquote').length)
  t.is(1, wrapper__blockquote.find('.ql-blockquote').length)
})


test('TextEditor: hr enables hr', t => {
  const f = Object.assign({}, field, { hr: true })
  const wrapper__default = mk(field, data_item, {}, true)
  const wrapper__hr      = mk(f,     data_item, {}, true)

  t.is(0, wrapper__default.find('.ql-hr').length)
  t.is(1, wrapper__hr.find('.ql-hr').length)
})

