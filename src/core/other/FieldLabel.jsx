import React from 'react';


export default function FieldLabel(props) {
  const align = props.is_top_level ? (props.align || 'right') : 'left';
    // In nested_blocks, field labels are always left-aligned, to make room
    // for nested_block's Delete button

  const class_align = {
    left:  'has-text-left',
    right: 'has-text-right',
  }[align] || 'has-text-right';
  const style_minwidth = props.min_width ? { minWidth: '9rem' } : { };
  const style_rpadding = props.align === 'left' ? { paddingRight: '1rem' } : { };
  const colon          = props.colon && !props.label.match(/\?$/);

  return (
    <div className={`label is-small ${class_align} has-text-grey`} style={{ ...style_minwidth, ...style_rpadding }}>
      <span className="">{props.label}{colon ? ':' : ''}</span>
    </div>
  );
}

