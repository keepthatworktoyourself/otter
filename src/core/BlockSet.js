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


export default function Blockset(definitions_array) {
  definitions_array.define = function(type, description, def) {
    def.type = type;
    def.description = description;
    definitions_array[type] = def;
  };

  definitions_array.get = function(__type) {
    if (!__type) {
      throw Error(utils.Err__BlockNoType());
    }

    const def = definitions_array.find(item => item.type === __type);
    if (def === undefined) {
      throw Error(utils.Err__NoComponentDef(__type));
    }

    return def;
  };

  return definitions_array;
};

