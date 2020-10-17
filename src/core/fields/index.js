import TextArea   from './TextArea';
import TextInput  from './TextInput';
import TextEditor from './TextEditor';
import Bool       from './Bool';
import Radios     from './Radios';
import Select     from './Select';
import WPMedia    from './WPMedia';
import ErrorField from './ErrorField';

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

