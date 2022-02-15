import React from 'react'
import NestedBlockWrapper from './NestedBlockWrapper'
import Repeater from './Repeater/Repeater'
import GridLayoutItem from './GridLayoutItem'
import FieldComponents from '../fields'
import OErrorMessage from '../default-ui/OErrorMessage'
import Fields from '../../definitions/fields'
import {find_block, display_if} from '../../definitions/utils'


// Errors
// ------------------------------------

function error_text__field_not_object(index, value) {
  const value_descr = value === null ? 'null' :
    value === undefined ? 'undefined' :
      typeof value

  return `
    In block definition, field at index ${index} is ${value_descr} instead of object
  `
}

function error_text__missing_field_props(index, errors) {
  return `
    In block definition, field at index ${index} is missing required properties:
    ${errors.join(', ')}
  `
}

function error_text__invalid_display_if(field_name, errors) {
  return `
    Field '${field_name}' display_if rule is invalid:
    ${errors.join(', ')}
  `
}

function error_text__invalid_field_type_in_field_definition(field_name, field_type) {
  return `
    Field '${field_name}' has an invalid field type ('${field_type}')
  `
}


// ensure_nested_block_data
// ------------------------------------

function ensure_nested_block_data(containing_data_item, field_def) {
  const current_nested_data = containing_data_item[field_def.name]
  if (current_nested_data) {
    return
  }

  else if (field_def.type === Fields.Repeater) {
    containing_data_item[field_def.name] = []
  }

  else if (field_def.type === Fields.NestedBlock) {
    const __type = typeof field_def.nested_block_type === 'string' ?
      field_def.nested_block_type :
      field_def.nested_block_type.type
    containing_data_item[field_def.name] = {__type}
  }
}


// RecursiveBlockRenderer
// ------------------------------------

export default function RecursiveBlockRenderer({
  data_item,
  containing_data_item,
  field_name,
  blocks,
  block_fields,
}) {
  const item       = data_item || containing_data_item[field_name]
  const block      = find_block(blocks, item.__type)
  const field_defs = block_fields || (block?.fields || [])

  const display_if_targets = field_defs
    .map(field_def => field_def && field_def.display_if)
    .filter(display_if => display_if && display_if.constructor === Array)
    .map(display_if => display_if.map(rule => rule.sibling))
    .flat()

  return field_defs.map((field_def, index) => {
    if (!field_def || typeof field_def !== 'object') {
      return (
        <OErrorMessage text={error_text__field_not_object(index, field_def)}
                       key={index} />
      )
    }

    const field_name = field_def.name
    const field_type = field_def.type
    const is_display_if_target = display_if_targets.includes(field_name)
    let out = null


    // Check required field properties
    const errors = [
      !field_type && 'type',
      !field_name && 'name',
    ].filter(Boolean)
    if (errors.length) {
      return (
        <OErrorMessage text={error_text__missing_field_props(index, errors)}
                       key={index} />
      )
    }


    // Conditional rendering
    const di = display_if(block, field_name, item)
    if (di.errors.length) {
      const text = error_text__invalid_display_if(field_name, di.errors)
      return (
        <OErrorMessage text={text}
                       key={index} />
      )
    }
    if (!di.display) {
      return null
    }


    // Render NestedBlocks
    if (field_type === Fields.NestedBlock) {
      ensure_nested_block_data(item, field_def)
      out = (
        <NestedBlockWrapper field_def={field_def}
                            containing_data_item={item}
                            key={index}
                            index={index}
        >
          <RecursiveBlockRenderer containing_data_item={item}
                                  field_name={field_name}
                                  blocks={blocks} />
        </NestedBlockWrapper>
      )
    }

    // Render Repeaters
    else if (field_type === Fields.Repeater) {
      ensure_nested_block_data(item, field_def)
      out = (
        <Repeater field_def={field_def}
                  containing_data_item={item}
                  key={index} />
      )
    }

    // Render other fields
    else {
      const Field = FieldComponents[field_type]
      const error_text = error_text__invalid_field_type_in_field_definition(field_name, field_type)
      out = (
        <GridLayoutItem field_def={field_def}
                        key={index}
        >
          {Field && (
            <Field field_def={field_def}
                   containing_data_item={item}
                   is_display_if_target={is_display_if_target} />
          )}
          {!Field && <OErrorMessage text={error_text} />}
        </GridLayoutItem>
      )
    }

    return out
  })
}
