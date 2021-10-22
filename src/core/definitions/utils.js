// utils.js


// uid
// -----------------------------------

let cur_uid = 0
export function uid() {
  return `uid-${cur_uid++}`
}


// retitle_field
// -----------------------------------

export function retitle_field(field, name, description) {
  const out = copy(field)

  out.name = name
  out.description = description

  return out
}


// humanify_str
// -----------------------------------

export function humanify_str(str) {
  str = (str || '').replace(/[-_]/g, ' ')
  str = str.replace(/ +/g, ' ')
  str = str.replace(/([a-z])([A-Z])/g, (_, c1, c2) => `${c1} ${c2.toLowerCase()}`)
  str = str.replace(/\s[a-z]$/, match => match.toUpperCase())
  return `${str.slice(0,1).toUpperCase()}${str.slice(1)}`
}


// debounce
// -----------------------------------

export function debounce(func, wait) {
  let timeout
  return function(...args) {
    function call() {
      timeout = null
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(call, wait)
  }
}


// debounce_promise
// -----------------------------------

export function debounce_promise(func, wait) {
  let timeout

  return function(...args) {
    clearTimeout(timeout)
    return new Promise(resolve => {
      timeout = setTimeout(() => resolve(func(...args)), wait)
    })
  }
}


// copy
// -----------------------------------

export function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}


// deep_equal
// -----------------------------------

export function deep_equal(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2)
}


// recursive_find
// -----------------------------------

export function recursive_find(obj, func) {
  if (func(obj)) {
    return obj
  }

  if (typeof obj !== 'object') {
    return null
  }

  for (let prop of Object.keys(obj)) {
    if (obj[prop] && typeof obj[prop] === 'object') {
      const result = recursive_find(obj[prop], func)
      if (result) {
        return result
      }
    }
  }
  return null
}


// find_block -> block or null
// -----------------------------------

export function find_block(blocks, type) {
  const defs = (blocks && blocks.constructor === Array) ? blocks : [blocks]

  return recursive_find(
    defs,
    item => item.type === type,
  )
}


// find_field
// -----------------------------------

export function find_field(fields, name) {
  return fields.find(item => item && item.name === name)
}


// is_data_item
// -----------------------------------

export function is_data_item(obj) {
  return obj && obj.constructor === Object && obj.__type
}


// iterate
// -----------------------------------

export function iterate(data, func) {
  func(data)

  const is_obj = data && data.constructor === Object
  const is_arr = data && data.constructor === Array

  if (is_arr) {
    data.forEach(item => iterate(item, func))
  }
  else if (is_obj) {
    Object.keys(data).forEach(k => iterate(data[k], func))
  }
}


// iterate_data
// -----------------------------------

export function iterate_data(data, func) {
  iterate(data, item => is_data_item(item) && func(item))
}


// check_display_if
// -----------------------------------

export function check_display_if(block, field) {
  function check_rule(rule) {
    if (rule.constructor !== Object) {
      return `display_if must be an object or array of objects`
    }

    const has_eq       = rule.equal_to !== undefined
    const has_neq      = rule.not_equal_to !== undefined
    const has_regex    = rule.matches !== undefined
    const has_nregex   = rule.doesnt_match !== undefined
    const has_sibling  = rule.sibling !== undefined

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
        RegExp(str)
      }
      catch (exc) {
        return err
      }
    }

    if (field.name === rule.sibling) {
      return `'sibling' cannot refer to same field`
    }

    const sibling = find_field(block.fields, rule.sibling)
    if (!sibling) {
      return `'sibling' does not exist in the block`
    }
  }

  const rules = field.display_if || false
  if (rules.constructor !== Array) {
    return [`display_if must be an object or array of objects`]
  }

  const errors = rules
    .map(check_rule)
    .filter(Boolean)

  return errors
}


// display_if
// -----------------------------------

export function display_if(block, field_name, data_item) {
  const field = find_field(block.fields, field_name)

  if (!field.display_if) {
    return {
      display: true,
      errors:  [],
    }
  }

  const errors = check_display_if(block, field)
  if (errors.length) {
    return {
      errors,
    }
  }

  const display = field.display_if.reduce((carry, rule) => {
    const sibling_value = data_item[rule.sibling]
    let out = carry

    if (rule.equal_to !== undefined) {
      out = carry && sibling_value === rule.equal_to
    }
    else if (rule.not_equal_to !== undefined) {
      out = carry && sibling_value !== rule.not_equal_to
    }
    else if (rule.matches !== undefined) {
      out = carry && (typeof sibling_value === 'string') && !!sibling_value.match(RegExp(rule.matches))
    }
    else if (rule.doesnt_match !== undefined) {
      out = carry && (typeof sibling_value === 'string') && !sibling_value.match(RegExp(rule.doesnt_match))
    }
    return out
  }, true)

  return {
    display,
    errors: [],
  }
}


// item_has_data
// -----------------------------------

export function all_items_exist_in(items, arr) {
  return items.reduce((carry, item) => {
    return carry && arr.includes(item)
  }, true)
}

export function item_has_data(item) {
  return (
    is_data_item(item) &&
    !all_items_exist_in(Object.keys(item), ['__type', '__uid'])
  )
}


// optional_nested_block__is_enabled
// -----------------------------------

export function optional_nested_block__is_enabled(field_name, data_item) {
  const enabled_nbs = data_item.__enabled_nested_blocks || { }

  if (enabled_nbs[field_name] !== undefined) {
    return !!enabled_nbs[field_name]
  }

  const sub_data_item = data_item[field_name]
  return !!item_has_data(sub_data_item)
}


// optional_nested_block__set_enabled
// -----------------------------------

export function optional_nested_block__set_enabled(field_name, data_item, enabled) {
  if (!data_item.__enabled_nested_blocks) {
    data_item.__enabled_nested_blocks = { }
  }

  data_item.__enabled_nested_blocks[field_name] = !!enabled
}


// blocks_are_grouped
// -----------------------------------

export function blocks_are_simple(blocks) {
  return blocks && blocks.constructor === Array
}

export function blocks_are_grouped(blocks) {
  return blocks && blocks.constructor === Object
}


// rnd_str
// -----------------------------------

function rnd_chr() {
  const i = Math.floor(97 + Math.random() * 26)
  return String.fromCharCode(i)
}

export function rnd_str(length) {
  let str = ''
  for (let i=0; i < length; ++i) {
    str += rnd_chr()
  }
  return str
}


// upto
// -----------------------------------

export function upto(n) {
  return Array.apply(null, {length: n}).map((_, i) => i)
}


// dynamic_data
// -----------------------------------

window.otter_dynamic_data = { }

export function dynamic_data(name) {
  return function() {
    if (window.otter_dynamic_data[name]) {
      return window.otter_dynamic_data[name]
    }

    if (window.otter_request_dynamic_data_from_iframe) {
      window.parent.postMessage({
        'otter--get-dynamic-data': name,
      })
    }

    return { }
  }
}

export function set_dynamic_data(name, value) {
  window.otter_dynamic_data[name] = value
}


// evaluate
// -----------------------------------

export function evaluate(val_or_func) {
  return typeof val_or_func === 'function' ? val_or_func() : val_or_func
}


// Some errors
// -----------------------------------

export function Err__BlockNoType(def) {
  console.log('Err__BlockNoType', def)
  return `Error: block without __type property!`
}
export function Err__BlockTypeNotFound(type) {
  console.log(Err__BlockTypeNotFound, `${type}`)
  return `Error: could not find block definition of desired type!`
}
export function Err__FieldNoType(def) {
  console.log('Err__FieldNoType', def)
  return `Error: all field definitions must have a 'type' property!`
}
export function Err__FieldNoName(def) {
  console.log('Err__FieldNoName', def)
  return `Error: all field definitions must have a 'name' property!`
}
export function Err__FieldDisplayIfInvalid(def) {
  console.log('Err__FieldDisplayIfInvalid', def)
  return `Error: display_if must be an object or array of objects!`
}
export function Err__FieldTypeNotFound(def) {
  console.log('Err__FieldTypeNotFound', def)
  return `Error: a field of the requested type does not exist!`
}
