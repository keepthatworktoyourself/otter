import React from 'react';
import * as utils from '../utils';
import Repeater from './Repeater';
import SubBlock from './SubBlock';


export default function RecursiveFieldRenderer(props) {
  const block = props.block;

  return Object.keys(block.fields).map(field_name => {
    const field = block.fields[field_name];

    if (!field.def.type) { throw Error(utils.Err__FieldNoType()); }
    if (!field.def.name) { throw Error(utils.Err__FieldNoName()); }

    // Conditional rendering
    if (field.def.display_if && field.def.display_if.constructor === Array) {
      const should_display = field.def.display_if.reduce((carry, rule) => {
        const sibling = block.fields[rule.sibling] || null;
        const rule_eq  = rule.hasOwnProperty('equal_to');
        const rule_neq = rule.hasOwnProperty('not_equal_to');
        if (!sibling || !(rule_eq || rule_neq)) {
          return carry;
        }
        if (rule_eq) {
          return carry && (sibling.value === rule.equal_to);
        }
        else {
          return carry && (sibling.value !== rule.not_equal_to);
        }
      }, true);

      if (!should_display) {
        return null;
      }
    }

    // Render fields
    let out = null;

    if (field.def.type === 'subblock') {
      out = <SubBlock block={field.value} field={field} contents_hidden={true} key={field.uid} />;
    }

    else if (field.def.type === 'subblock array') {
      out = <Repeater block={block} field={field} key={field.uid} />;
    }

    else {
      out = <field.def.type block={block} field={field} key={field.uid} />
    }

    return out;
  });
}

