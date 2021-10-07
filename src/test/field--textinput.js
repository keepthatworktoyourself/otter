import test from 'ava'
import React from 'react'
import {mount, configure} from 'enzyme'
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
      name:        'title',
      description: 'Title',
      type:        Otter.Fields.TextInput,
    },
  ],
}
const data_item = {
  __type: 'X',
  title:  'Welcome to Jurassic Park',
}


function mk(field_def, containing_data_item, ctx_methods, is_top_level) {
  const Prov = PageDataContext.Provider
  return mount(
    <Prov value={ctx_methods}>
      <Otter.Fields.components.TextInput field_def={field_def}
                                         containing_data_item={containing_data_item}
                                         is_top_level={is_top_level} />
    </Prov>,
  )
}


test('TextInput: renders textarea containing initial value', t => {
  const wrapper = mk(block.fields[0], data_item, {}, true)
  const textinput = wrapper.find('input')
  t.is(1, textinput.length)
  t.is(data_item.title, textinput.prop('value'))
})


test('TextInput: value change updates state, calls ctx value_updated only', t => {
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
  const textinput = wrapper.find('input')
  const new_value = 'Clever girl'

  textinput.prop('onChange')({target: {value: new_value}})
  t.is(true,      ctx.value_updated.called)
  t.is(undefined, ctx.redraw.called)
  t.is(new_value, d.title)
})


test('TextInput: renders label, passes through is_top_level', t => {
  const wrapper__top    = mk(block.fields[0], data_item, {}, true)
  const wrapper__nested = mk(block.fields[0], data_item, {}, false)

  const lbl__top    = wrapper__top.find('FieldLabel')
  const lbl__nested = wrapper__nested.find('FieldLabel')

  t.is(1, lbl__top.length)
  t.is(1, lbl__nested.length)
  t.is('Title', lbl__top.get(0).props.label)
  t.is(true,  lbl__top.get(0).props.is_top_level)
  t.is(false, lbl__nested.get(0).props.is_top_level)
})

