import Utils from './definitions/utils';

export default function Blockset(blocks) {
  const defs = blocks.constructor === Array ? blocks : [ blocks ];

  defs.get = (type) => {
    const def = Utils.recursive_find(
      defs,
      item => item.hasOwnProperty('type') && item.type === type
    );

    if (def === null) {
      throw Error(Utils.Err__NoComponentDef(type));
    }

    return def;
  };

  return defs;
};

