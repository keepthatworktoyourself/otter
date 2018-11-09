// utils.js

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
  rnd_str,
  Err__BlockNoType,
  Err__FieldNoType,
  Err__FieldNoName,
  Err__NoComponentDef,
  Err__InvalidComponentDef,
};

