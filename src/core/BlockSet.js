import * as utils from './utils';

// Example block definition:
//   {
//     name: 'item_content',     // field name
//     description: 'Content',   // optional: human readable name ('name' is typically a data storage key)
//
//     type: Radios,             // one of the field components or 'subblock' or 'subblock array'
//
//     // Radio:
//     options: {
//       light: 'Light',
//       dark: 'Dark',
//       vizia: 'Vizia',
//     },
//
//     // 'subblock':
//     subblock_type: PBImage,   // which subblock to render
//
//     // 'subblock array':
//     subblock_types: [ PBImage, PBText ],  // if type is 'subblock array' - the allowed types in the repeater
//
//     // Bool:
//     text__yes: '',  // display text (optional, default: 'Yes')
//     text__no:  '',  // ~            (optional, default: 'No')
//
//     // conditional display (NB only works on Bool/Radio/Select siblings)
//     display_if: [{
//       sibling: 'name of sibling field',
//       equal_to: value,
//     }],
//   },
//   ...
// ]

export default function Blockset() {
  const ret = {
    define(type, description, def) {
      ret[type] = def;
      ret[type].type = type;
      ret[type].description = description;
    },

    get(__type) {
      if (!__type) {
        throw Error(utils.Err__BlockNoType());
      }
      const def = ret[__type];
      if (!def) {
        throw Error(utils.Err__NoComponentDef(__type));
      }
      if (def.constructor !== Array) {
        throw Error(utils.Err__InvalidComponentDef(__type));
      }
      return def;
    },

    get_all() {
      return Object.keys(ret).filter(type => ret[type].constructor === Array);
    },
  };

  return ret;
};

