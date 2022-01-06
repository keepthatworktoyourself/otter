const Fields = {
  TextInput:   'TextInput',
  TextArea:    'TextArea',
  TextEditor:  'TextEditor',
  Bool:        'Bool',
  Radios:      'Radios',
  Select:      'Select',
  WPMedia:     'WPMedia',
  NestedBlock: 'NestedBlock',
  Repeater:    'Repeater',
  Searchable:  'Searchable',
  ErrorField:  'ErrorField',

  mk_textinput:  (name, description) => ({name, description, type: Fields.TextInput}),
  mk_textarea:   (name, description) => ({name, description, type: Fields.TextInput}),
  mk_texteditor: (name, description) => ({name, description, type: Fields.TextInput}),
}

export default Fields
