import is_obj from './is-obj.js'

function assign_props(onto, obj) {
  if (is_obj(obj)) {
    Object.keys(obj).forEach(k => {
      const item = obj[k]

      if (is_obj(item)) {
        if (!is_obj(onto[k])) {
          onto[k] = { }
        }
        assign_props(onto[k], item)
      }
      else {
        onto[k] = item
      }
    })
  }

  return onto
}

export default function merge(...objs) {
  return objs.reduce(assign_props, {})
}

export function merge_onto(...objs) {
  return objs
    .slice(1)
    .reduce(assign_props, objs[0])
}
