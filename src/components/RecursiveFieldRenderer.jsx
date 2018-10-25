import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import * as utils from '../utils';
import Repeater from './Repeater';
import InnerBlock from './InnerBlock';


export default class RecursiveFieldRenderer extends React.Component {

  constructor(props) {
    super(props);
  }


  render__field(block, field) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{marginBottom: '0.5rem' }}>{field.def.description || field.def.name}</h4>
        {<field.def.type block={block} field={field} />}
      </div>
    );
  }


  render() {
    const block = this.props.block;

    return Object.keys(block.fields).map(field_name => {
      const field = block.fields[field_name];

      if (!field.def.type) { throw Error(utils.Err__FieldNoType()); }
      if (!field.def.name) { throw Error(utils.Err__FieldNoName()); }

      const field_value = field.value || null;
      let out = null;

      if (field.def.type === 'sub-block') {
        out = <InnerBlock block={field.value} field={field} contents_hidden={true} />;
      }

      else if (field.def.type === 'sub-block array') {
        out = <Repeater block={block} field={field} />;
      }

      else {
        out = this.render__field(block, field);
      }

      return out;
    });
  }

}

