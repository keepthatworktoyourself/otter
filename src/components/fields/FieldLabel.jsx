import React from 'react';


export default function FieldLabel(props) {
  const field = props.field;
  const class_align = {
    left: 'has-text-left',
    right: 'has-text-right',
  }[props.align || 'right'] || 'has-text-right';

  return (
    <div className={`label is-small ${class_align} has-text-grey`}>
      <span className="">{field.def.description || field.def.name}{props.colon ? ':' : ''}</span>
    </div>
  );
}

