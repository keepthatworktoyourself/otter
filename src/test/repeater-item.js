import test from 'ava'
import React from 'react'
import {shallow, mount, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import RepeaterItem from '../core/RepeaterItem'
import BlockDeleteBtn from '../core/other/BlockDeleteBtn'
import test_blocks from './_test-blocks'
import test_data from './_test-data'
import stubs from './_stubs'
import Otter from '..'


configure({adapter: new Adapter()})


const provided = {
  innerRef:       null,
  draggableProps: {
    style: {color: 'yellow'},
  },
}
const snapshot = {
  isDragging: false,
}


const ctx = () => ({
  value_updated: sinon.spy(),
  redraw:        sinon.spy(),
  block_toggled: sinon.spy(),
  blocks:        test_blocks(),
})


function mk(index, dnd_context_id, cb__delete, children) {
  return shallow(
    <RepeaterItem index={index}
                  dnd_context_id={dnd_context_id}
                  draggable_component={stubs.func_stub([provided, snapshot])}
                  cb__delete={cb__delete}
    >
      {children}
    </RepeaterItem>,
  )
}


test('RepeaterItem: renders draggable', t => {
  const wrapper = mk(9, 'my-draggable-context', null, [])
  t.truthy(wrapper.prop('draggableId'))
  t.is('my-draggable-context', wrapper.prop('type'))
  t.is(9, wrapper.prop('index'))
})


test('RepeaterItem: renders child', t => {
  const wrapper = mk(0, 'x', null, [
    <div className="my-child" key="x"></div>,
  ])
  t.is(1, wrapper.dive().find('.my-child').length)
})


test('RepeaterItem: if cb__delete passed, renders delete button', t => {
  const wrapper = mk(0, 'x', sinon.spy(), [])
  t.is(1, wrapper.dive().findWhere(node => node.type() === BlockDeleteBtn).length)
})


test('RepeaterItem: when delete button clicked, calls cb__delete(index)', t => {
  const cb__delete = sinon.spy()
  const wrapper = mk(76, 'x', cb__delete, [])
  wrapper.dive().findWhere(node => node.type() === BlockDeleteBtn).prop('cb__delete')()
  t.true(cb__delete.calledOnce)
  t.deepEqual([76], cb__delete.firstCall.args)
})

