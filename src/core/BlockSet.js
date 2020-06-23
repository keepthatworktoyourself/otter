import * as utils from './utils';

export default function Blockset(definitions_array) {
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

