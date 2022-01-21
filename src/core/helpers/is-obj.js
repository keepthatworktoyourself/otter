export default function is_obj(obj) {
  return !!(obj && typeof obj === 'object' && obj.constructor === Object)
}
