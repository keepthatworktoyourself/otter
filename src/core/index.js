//
// index.js - define iceberg's api
//

import Iceberg from './Iceberg';
import Blockset from './Blockset';
import TextArea   from './fields/TextArea';
import TextInput  from './fields/TextInput';
import TextEditor from './fields/TextEditor';
import Bool       from './fields/Bool';
import Radios     from './fields/Radios';
import WPImage    from './fields/WPImage';

const Fields = {
  TextArea,
  TextInput,
  TextEditor,
  Bool,
  Radios,
  WPImage,
};

export {
  Iceberg,
  Blockset,
  Fields,
};

