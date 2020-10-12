import React from 'react';
import Fields from './fields';
import SubBlockWrapper from './SubBlockWrapper';
import Repeater from './Repeater';
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
  const is_top_level = props.is_top_level;
  const blocks       = props.blocks;
  const block        = Utils.find_block(blocks, data_item.__type);

  return (block.fields || []).map((field_def, index) => {
    const field_name = field_def.name;
    const field_type = field_def.type;
    const field_value = data_item[field_name];
    let out = null;


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


    // Render SubBlocks / Repeaters
    if (field_type === Fields.SubBlock || field_type === Fields.SubBlockArray) {
      out = (
        <SubBlockWrapper field_def={field_def} containing_data_item={data_item}>
          {field_type === Fields.SubBlock && (
            <RecursiveBlockRenderer data_item={field_value} blocks={blocks} />
          )}

          {field_type === Fields.SubBlockArray && (
            <Repeater field_def={field_def} containing_data_item={data_item} />
          )}
        </SubBlockWrapper>
      );
    }


    // Render fields
    else {
      const Field = Fields.components[field_type];
      if (Field) {
        out = <Field field_def={field_def}
                     containing_data_item={data_item}
                     is_top_level={is_top_level}
                     key={index} />;
      }
      else {
        out = <Fields.components.ErrorField text={error_text__invalid_field_type_in_field_definition(field_name, field_type)}
                                            is_top_level={is_top_level} />;
      }
    }

    return out;
  });
};

