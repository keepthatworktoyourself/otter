// Utils.js


// retitle_field
// -----------------------------------

function retitle_field(field, name, description) {
  const f = Object.assign({}, field);
  f.name = name || f.name;
  f.description = description || f.description;

  return f;
}


// recursive_find
// -----------------------------------

function recursive_find(obj, f) {
  if (f(obj)) {
    return obj;
  }

  else {
    if (typeof obj === 'object') {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          const result = recursive_find(obj[prop], f);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  return null;
}


// subblock_is_enabled
// -----------------------------------
// - NB non-optional fields always -> true

function subblock_is_enabled(field) {
  const is_optional = field && field.def.optional;
  const is_optional_and_enabled = is_optional && field.enabled;
  return !is_optional || is_optional_and_enabled;
}


// rnd_str
// -----------------------------------

function rnd_str(length) {
  function rnd_chr() {
    const i = Math.floor(97 + Math.random() * 26);
    return String.fromCharCode(i);
  }

  let s = '';
  for (let i=0; i < length; ++i) {
    s += rnd_chr();
  }

  return s;
}


// Some errors
// -----------------------------------

function Err__BlockNoType() {
  return `Error: block without __type property!`;
}
function Err__FieldNoType() {
  return `Error: field definition with missing or invalid type property!`;
}
function Err__FieldNoName() {
  return `Error: field definition without name property!`;
}
function Err__NoComponentDef(block_type) {
  return `Error: no component definition found for '${block_type}' block`;
}
function Err__InvalidComponentDef(block_type) {
  return `Error: invalid component definition found for '${block_type}' block`;
}


export default {
  retitle_field,
  recursive_find,
  subblock_is_enabled,
  rnd_str,
  Err__BlockNoType,
  Err__FieldNoType,
  Err__FieldNoName,
  Err__NoComponentDef,
  Err__InvalidComponentDef,
};

