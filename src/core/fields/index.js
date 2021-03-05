import TextArea   from './TextArea';
import TextInput  from './TextInput';
import TextEditor from './TextEditor';
import Bool       from './Bool';
import Radios     from './Radios';
import Select     from './Select';
import WPMedia    from './WPMedia';
import ErrorField from './ErrorField';

function mk_field(name, description, type) {
  return {
    name:        name,
    description: description || null,
    type:        type,
  };
}


const fields = {
  TextInput:        'TextInput',
  TextArea:         'TextArea',
  TextEditor:       'TextEditor',
  Bool:             'Bool',
  Radios:           'Radios',
  Select:           'Select',
  WPMedia:          'WPMedia',
  NestedBlock:      'NestedBlock',
  Repeater:         'Repeater',

  mk_textinput:  (name, descr)       => mk_field(name, descr, fields.TextInput),
  mk_textarea:   (name, descr, opts) => Object.assign(mk_field(name, descr, fields.TextArea),   opts || { }),
  mk_texteditor: (name, descr, opts) => Object.assign(mk_field(name, descr, fields.TextEditor), opts || { }),

  components: {
    TextInput,
    TextArea,
    TextEditor,
    Bool,
    Radios,
    Select,
    WPMedia,
    ErrorField,
  },
};

export default fields;

