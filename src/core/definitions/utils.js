// Utils.js


// uid
// -----------------------------------

function uid() {
  return `uid-${uid.i++}`
}
uid.i = 0


// retitle_field
// -----------------------------------

function retitle_field(field, name, description) {
  const f = copy(field)

  f.name = name
  f.description = description

  return f
}


// humanify_str
// -----------------------------------

function humanify_str(s) {
  s = (s || '').replace(/[-_]/g, ' ')
  s = s.replace(/ +/g, ' ')
  s = s.replace(/([a-z])([A-Z])/g, (m, c1, c2) => `${c1} ${c2.toLowerCase()}`)
  s = s.replace(/\s[a-z]$/, (m) => m.toUpperCase())
  return `${s.slice(0,1).toUpperCase()}${s.slice(1)}`
}


// copy
// -----------------------------------

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}


// deep_equal
// -----------------------------------

function deep_equal(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2)
}


// recursive_find
// -----------------------------------

function recursive_find(obj, f) {
  if (f(obj)) {
    return obj
  }

  else {
    if (typeof obj === 'object') {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] && typeof obj[prop] === 'object') {
          const result = recursive_find(obj[prop], f)
          if (result) {
            return result
          }
        }
      }
    }
  }

  return null
}


// find_block -> block or null
// -----------------------------------

function find_block(blocks, type) {
  const defs = (blocks && blocks.constructor === Array) ? blocks : [ blocks ]

  return recursive_find(
    defs,
    item => item.hasOwnProperty('type') && item.type === type
  )
}


// find_field
// -----------------------------------

function find_field(fields, name) {
  return fields.find(item => item && item.name === name)
}


// is_data_item
// -----------------------------------

function is_data_item(obj) {
  return obj && obj.constructor === Object && obj.hasOwnProperty('__type')
}


// iterate
// -----------------------------------

function iterate(data, f) {
  f(data)

  const is_obj = data && data.constructor === Object
  const is_arr = data && data.constructor === Array

  if (is_arr) {
    data.forEach(item => iterate(item, f))
  }
  else if (is_obj) {
    Object.keys(data).forEach(k => iterate(data[k], f))
  }
}


// iterate_data
// -----------------------------------

function iterate_data(data, f) {
  iterate(data, (item) => is_data_item(item) && f(item))
}


// check_display_if
// -----------------------------------

function check_display_if(block, field) {
  function check_rule(rule) {
    if (rule.constructor !== Object) {
      return `display_if must be an object or array of objects`
    }

    const has_eq       = rule.hasOwnProperty('equal_to')
    const has_neq      = rule.hasOwnProperty('not_equal_to')
    const has_regex    = rule.hasOwnProperty('matches')
    const has_nregex   = rule.hasOwnProperty('doesnt_match')
    const has_sibling  = rule.hasOwnProperty('sibling')

    const valid = has_sibling && (has_eq || has_neq || has_regex || has_nregex)
    if (!valid) {
      return `must have properties sibling, and equal_to|not_equal_to|matches|doesnt_match`
    }

    if (has_regex || has_nregex) {
      const err = `matches or doesnt_match must be a string that compiles to a regex`
      const str = has_regex ? rule.matches : rule.doesnt_match
      const valid = typeof str === 'string' || str.constructor === RegExp

      if (!valid) {
        return err
      }

      try {
        const r = RegExp(str)
      }
      catch (exc) {
        return err
      }
    }

    if (field.name === rule.sibling) {
      return `sibling cannot refer to the self field`
    }

    const sibling = find_field(block.fields, rule.sibling)
    if (!sibling) {
      return `sibling does not exist in the block`
    }
  }

  const rules = field.display_if || false
  if (rules.constructor !== Array) {
    return [`display_if must be an object or array of objects`]
  }

  const errors = rules
    .map(check_rule)
    .filter(x => x)

  return errors
}


// display_if
// -----------------------------------

function display_if(block, field_name, data_item) {
  const field = find_field(block.fields, field_name)

  if (!field.display_if) {
    return {
      display: true,
      errors: [],
    }
  }

  const errors = check_display_if(block, field)
  if (errors.length) {
    return {
      errors,
    }
  }

  const display = field.display_if.reduce((carry, rule) => {
    const has_eq       = rule.hasOwnProperty('equal_to')
    const has_neq      = rule.hasOwnProperty('not_equal_to')
    const has_regex    = rule.hasOwnProperty('matches')
    const has_nregex   = rule.hasOwnProperty('doesnt_match')
    const sibling_value = data_item[rule.sibling]

    if (has_eq) {
      return carry && sibling_value === rule.equal_to
    }
    else if (has_neq) {
      return carry && sibling_value !== rule.not_equal_to
    }
    else if (has_regex) {
      return carry && (typeof sibling_value === 'string') && !!sibling_value.match(RegExp(rule.matches))
    }
    else if (has_nregex) {
      return carry && (typeof sibling_value === 'string') && !sibling_value.match(RegExp(rule.doesnt_match))
    }
    return carry
  }, true)

  return {
    display,
    errors: [],
  }
}


// item_has_data
// -----------------------------------

function all_items_exist_in(items, arr) {
  return items.reduce((carry, item) => {
    return carry && arr.includes(item)
  }, true)
}

function item_has_data(item) {
  return (
    item &&
    item.constructor === Object &&
    item.hasOwnProperty('__type') &&
    !all_items_exist_in(Object.keys(item), [ '__type', '__uid' ])
  )
}


// optional_nested_block__is_enabled
// -----------------------------------

function optional_nested_block__is_enabled(field_name, data_item) {
  const es = data_item.__enabled_nested_blocks

  if (es && es.hasOwnProperty(field_name)) {
    return !!es[field_name]
  }

  else {
    const sub_data_item = data_item[field_name]
    return !!item_has_data(sub_data_item)
  }
}


// optional_nested_block__set_enabled
// -----------------------------------

function optional_nested_block__set_enabled(field_name, data_item, enabled) {
  if (!data_item.__enabled_nested_blocks) {
    data_item.__enabled_nested_blocks = { }
  }

  if (enabled) {
    data_item.__enabled_nested_blocks[field_name] = true
  }
  else {
    data_item.__enabled_nested_blocks[field_name] = false
  }
}


// blocks_are_grouped
// -----------------------------------

function blocks_are_simple(blocks) {
  return blocks && blocks.constructor === Array
}

function blocks_are_grouped(blocks) {
  return blocks && blocks.constructor === Object
}


// rnd_str
// -----------------------------------

function rnd_str(length) {
  function rnd_chr() {
    const i = Math.floor(97 + Math.random() * 26)
    return String.fromCharCode(i)
  }

  let s = ''
  for (let i=0; i < length; ++i) {
    s += rnd_chr()
  }

  return s
}


// upto
// -----------------------------------

function upto(n) {
  return Array.apply(null, {length: n}).map((_, i) => i)
}


// dynamic_data
// -----------------------------------

function dynamic_data(name) {
  return function() {
    if (dynamic_data.data.hasOwnProperty(name)) {
      return dynamic_data.data[name];
    }

    if (dynamic_data.request_from_iframe) {
      window.parent.postMessage({
        'otter--get-dynamic-data': name,
      });
    }

    return { };
  };
}
function set_dynamic_data(name, value) {
  dynamic_data.data[name] = value
}
dynamic_data.data = { };


// Some errors
// -----------------------------------

function Err__BlockNoType(def) {
  console.log('Err__BlockNoType', def)
  return `Error: block without __type property!`
}
function Err__BlockTypeNotFound(type) {
  console.log(Err__BlockTypeNotFound, `${type}`)
  return `Error: could not find block definition of desired type!`
}
function Err__FieldNoType(def) {
  console.log('Err__FieldNoType', def)
  return `Error: all field definitions must have a 'type' property!`
}
function Err__FieldNoName(def) {
  console.log('Err__FieldNoName', def)
  return `Error: all field definitions must have a 'name' property!`
}
function Err__FieldDisplayIfInvalid(def) {
  console.log('Err__FieldDisplayIfInvalid', def)
  return `Error: display_if must be an object or array of objects!`
}
function Err__FieldTypeNotFound(def) {
  console.log('Err__FieldTypeNotFound', def)
  return `Error: a field of the requested type does not exist!`
}


export default {
  uid,
  find_field,
  retitle_field,
  humanify_str,
  copy,
  deep_equal,
  recursive_find,
  find_block,
  is_data_item,
  iterate,
  iterate_data,
  check_display_if,
  display_if,
  all_items_exist_in,
  item_has_data,
  optional_nested_block__is_enabled,
  optional_nested_block__set_enabled,
  blocks_are_simple,
  blocks_are_grouped,
  rnd_str,
  upto,
  dynamic_data,
  set_dynamic_data,
  Err__BlockNoType,
  Err__BlockTypeNotFound,
  Err__FieldNoType,
  Err__FieldNoName,
  Err__FieldDisplayIfInvalid,
  Err__FieldTypeNotFound,
}

