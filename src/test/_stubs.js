import React from 'react';


function Stub(props) {
  Stub.last_props = props;
  return (
    <div>
      {props.children}
    </div>
  );
}


function func_stub(child_args) {
  return function ChildFunctionStub(props) {
    return (
      <div>
        {props.children(...child_args)}
      </div>
    );
  };
}


export default {
  Stub,
  func_stub,
};

