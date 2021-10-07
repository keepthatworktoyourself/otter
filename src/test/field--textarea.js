import test from 'ava'
import React from 'react'
import {shallow, mount, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as DnD from 'react-beautiful-dnd'
import PageDataContext from '../core/PageDataContext'
import RecursiveBlockRenderer from '../core/RecursiveBlockRenderer'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({adapter: new Adapter()})


const block = {
  type:   'X',
  fields: [
    {
      name:        'textarea_field',
      description: 'Some text',
      type:        Otter.Fields.TextArea,
    },
  ],
}
const data_item = {
  __type:         'X',
  textarea_field: 'To be, or not to be...',
}


function mk(field_def, containing_data_item, ctx_methods, is_top_level) {
  const Prov = PageDataContext.Provider
  return mount(
    <Prov value={ctx_methods}>
      <Otter.Fields.components.TextArea field_def={field_def}
                                        containing_data_item={containing_data_item}
                                        is_top_level={is_top_level} />
    </Prov>,
  )
}


test('TextArea: renders textarea containing initial value', t => {
  const wrapper = mk(block.fields[0], data_item, {}, true)
  const textarea = wrapper.find('textarea')

  t.is(1, textarea.length)
  t.is(data_item.textarea_field, textarea.get(0).props.value)
})


test('TextArea: value change updates state, calls ctx value_updated only', t => {
  const ctx = {
    value_updated() {
      ctx.value_updated.called = true
    },
    redraw() {
      ctx.redraw.called = true
    },
  }
  const d = Otter.Utils.copy(data_item)

  const wrapper = mk(block.fields[0], d, ctx)
  const textarea = wrapper.find('textarea')
  const new_value = '...that is the question.'

  textarea.prop('onChange')({target: {value: new_value}})
  t.is(true,      ctx.value_updated.called)
  t.is(undefined, ctx.redraw.called)
  t.is(new_value, d.textarea_field)
})


test('TextArea: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk(block.fields[0], data_item, {}, true)
  const wrapper__nested = mk(block.fields[0], data_item, {}, false)

  const lbl__top    = wrapper__top.find('FieldLabel')
  const lbl__nested = wrapper__nested.find('FieldLabel')

  t.is(1, lbl__top.length)
  t.is(1, lbl__nested.length)
  t.is('Some text', lbl__top.get(0).props.label)
  t.is(true,  lbl__top.get(0).props.is_top_level)
  t.is(false, lbl__nested.get(0).props.is_top_level)
})

