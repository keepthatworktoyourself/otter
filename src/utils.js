// utils.js

function get_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function format_label(str) {
    str = str.replace("_", " ");
    return capitalize(str);
}

function str_hash(str) {
  let hash = 0
  for (let i=0, len=str.length; i < len; ++i) {
    let chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32 bit integer
  }
  return hash.toString();
}

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

function getter_key(field_name) {
  return `__getter__${field_name}`;
}

function is_getter_key(str) {
  return str.match(/^__getter__/);
}

function key_from_getter_key(gk) {
  return gk.replace(/^__getter__/, '');
}

function is_block(item) {
  return item && item.constructor === Object && item.__type;
}

function is_block_array(item) {
  return item && item.constructor === Array && is_block(item[0]);
}


// Some errors
// -----------------------------------

function Err__BlockNoType() {
  return `Error: block without __type property!`;
}
function Err__FieldNoType() {
  return `Error: field definition without type property!`;
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




export {
  get_random_int,
  capitalize,
  format_label,
  str_hash,
  rnd_str,
  getter_key,
  is_getter_key,
  key_from_getter_key,
  is_block,
  is_block_array,
  Err__BlockNoType,
  Err__FieldNoType,
  Err__FieldNoName,
  Err__NoComponentDef,
  Err__InvalidComponentDef,
};

