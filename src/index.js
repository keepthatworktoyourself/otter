import {Iceberg, Blockset, Fields} from './core/index';

import './index.css';
import 'bulma/css/bulma.min.css';
import './quill.snow.css';

Iceberg.Blockset = Blockset;
Iceberg.Fields = Fields;

export default Iceberg;



// Respond to queries for body height
// ------------------------------------

window.addEventListener('message', function(ev) {
  if (ev.data === 'get-height') {
    const body_height = getComputedStyle(document.body).height;
    ev.source.postMessage({
      'set-height': body_height
    }, event.origin);
  }
});

