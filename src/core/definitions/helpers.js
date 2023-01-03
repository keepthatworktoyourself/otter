import FieldTypes from './field-types'

export default {
  mk_textinput:  (name, description) => ({name, description, type: FieldTypes.TextInput}),
  mk_textarea:   (name, description) => ({name, description, type: FieldTypes.TextInput}),
  mk_texteditor: (name, description) => ({name, description, type: FieldTypes.TextInput}),
}