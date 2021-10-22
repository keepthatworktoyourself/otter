const fields = {
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

  mk_textinput:  (name, description) => ({name, description, type: fields.TextInput}),
  mk_textarea:   (name, description) => ({name, description, type: fields.TextInput}),
  mk_texteditor: (name, description) => ({name, description, type: fields.TextInput}),
}

export default fields
