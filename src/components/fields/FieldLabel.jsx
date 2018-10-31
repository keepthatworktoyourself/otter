import React from 'react';


export default function FieldLabel(props) {
  const field = props.field;
  const block = props.block;

  const align = !block.is_top_level ? 'left' : (props.align || 'right');
    // In subblocks, field labels are always left-aligned, to make room
    // for the Delete button in Repeaters

  const class_align = {
    left: 'has-text-left',
    right: 'has-text-right',
  }[align] || 'has-text-right';
  const style_minwidth = props.min_width ? { minWidth: '9rem' } : { };
  const style_rpadding = props.align === 'left' ? { paddingRight: '1rem' } : { };
  const label = field.def.description || field.def.name;
  const colon = colon && !label.match(/\?$/);

  return (
    <div className={`label is-small ${class_align} has-text-grey`} style={{ ...style_minwidth, ...style_rpadding }}>
      <span className="">{label}{colon ? ':' : ''}</span>
    </div>
  );
}

