import Utils from './definitions/utils';

export default function Blockset(definitions_array) {
  definitions_array.get = function(type) {
    if (!type) {
      throw Error(Utils.Err__BlockNoType());
    }

    const def = Utils.recursive_find(definitions_array, item => (
      item.hasOwnProperty('type') && item.type === type
    ));
    if (def === null) {
      throw Error(Utils.Err__NoComponentDef(type));
    }

    return def;
  };

  return definitions_array;
};

