import Iceberg from './core/Iceberg';
import Blockset from './core/Blockset';
import Fields from './core/fields';
import State from './core/state';
import Save from './core/save';

Iceberg.Blockset = Blockset;
Iceberg.Fields = Fields;
Iceberg.State = State;
Iceberg.Save = Save;

import './index.css';
import 'bulma/css/bulma.min.css';
import './quill.snow.css';

export default Iceberg;

