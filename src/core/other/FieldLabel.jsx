import React from 'react';


export default function FieldLabel(props) {
  const style_minwidth = props.min_width ? { minWidth: '9rem' } : { };
  const style_rpadding = { paddingRight: '1rem' };
  const colon          = props.colon && !props.label.match(/\?$/);

  return (
    <div className={`label is-small has-text-grey`} style={{ ...style_minwidth, ...style_rpadding }}>
      <span className="">{props.label}{colon ? ':' : ''}</span>
    </div>
  );
}

