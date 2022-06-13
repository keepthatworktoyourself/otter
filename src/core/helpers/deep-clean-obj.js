export default function deep_clean_obj(obj, props_to_remove = []) {
  return Object.entries(obj)
    .reduce((carry, [prop, val]) => {
      if (!props_to_remove.includes(prop)) {
        if (Array.isArray(val)) {
          val = val.map(item => deep_clean_obj(item, props_to_remove))
        }
        else if (typeof val === 'object' && val !== null) {
          val = deep_clean_obj(val, props_to_remove)
        }
        carry[prop] = val
      }
      return carry
    }, {})
}
