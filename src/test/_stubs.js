import React from 'react'

function mk_stub(type) {
  return function s(props) {
    s.last_props = props
    return (
      <div type={type} {...props}>
        {props.children}
      </div>
    )
  }
}

function func_stub(child_args) {
  return function ChildFunctionStub(props) {
    return (
      <div>
        {props.children(...child_args)}
      </div>
    )
  }
}

export default {
  mk_stub,
  func_stub,
}

