import React from 'react';
import Repeater from './Repeater';
import Fields from './fields';
import SubBlock from './SubBlock';
import Utils from './definitions/utils';


function error_text__missing_field_props(field_name, errors) {
  return `
    In block definition, field '${field_name}' is missing required properties:
    ${errors.join(', ')}
  `;
}

function error_text__invalid_display_if(field_name, errors) {
  return `
    Field '${field_name}' display_if rule is invalid:
    ${errors.join(', ')}
  `;
}

function error_text__invalid_field_type_in_field_definition(field_name, field_type) {
  return `
    Field '${field_name}' has an invalid field type ('${field_type}')
  `;
}


export default function RecursiveBlockRenderer(props) {
  const data_item    = props.data_item;
  const block        = props.block;
  const is_top_level = props.is_top_level || false;

  return (block.fields || []).map(field_def => {
    const field_name = field_def.name;
    const field_type = field_def.type;
    const field_value = data_item[field_name];

    // Check required field properties
    const errors = [ ];
    if (!field_type) { errors.push('type'); }
    if (!field_name) { errors.push('name'); }
    if (errors.length) {
      return <Fields.components.ErrorField text={error_text__missing_field_props(field_name, errors)}
                                           is_top_level={is_top_level} />;
    }


    // Conditional rendering
    const di = Utils.display_if(block, field_name, data_item);
    if (di.errors.length) {
      return <Fields.components.ErrorField text={error_text__invalid_display_if(field_name, di.errors)}
                                           is_top_level={is_top_level} />;
    }
    if (!di.display) {
      return null;
    }


    // Render fields
    let out = null;

    if (field_def.type === Fields.SubBlock) {
      out = <SubBlock field_def={field_def} containing_block={block} containing_data_item={data_item} />;
    }

    else if (field_def.type === Fields.SubBlockArray) {
      out = <Repeater field_def={field_def} containing_block={block} containing_data_item={data_item} />;
    }

    else {
      const Field = Fields.components[field_def.type];
      if (Field) {
        out = <Field field_def={field_def}
                     containing_data_item={data_item}
                     is_top_level={is_top_level} />;
      }
      else {
        out = <Fields.components.ErrorField text={error_text__invalid_field_type_in_field_definition(field_name, field_def.type)}
                                            is_top_level={is_top_level} />;
      }
    }

    return out;
  });
};

