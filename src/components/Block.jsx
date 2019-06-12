import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import component_definitions from '../component-mapping';


function Err__BlockNoType() {
  return `Error: block without __type property!`;
}
function Err__FieldNoType() {
  return `Error: field definition without type property!`;
}
function Err__FieldNoName() {
  return `Error: field definition without name property!`;
}
function Err__NoComponentDef(b) {
  return `Error: no component definition found for '${b.__type}' block`;
}

function get_block_def(block) {
  if (!block || !block.__type) {
    throw Error(Err__BlockNoType());
  }
  const def = component_definitions[block.__type];
  if (!def) {
    throw Error(Err__NoComponentDef(block));
  }
  return def;
}



class DataChannel {
  constructor() {
    this.handler = null;
  }

  get() {
    return this.handler ? this.handler() : null;
  }
}



const subblock_styles = {
  padding: '1rem',
  marginBottom: '1rem',
  marginLeft: '1rem',
  border: '1px solid rgba(0,0,0, 0.075)',
  backgroundColor: 'rgba(0,0,0, 0.025)',
};


export default class Block extends React.Component {

  constructor(props) {
    super(props);
  }


  mk_field(block, field_def) {
    const dc_key = `__field__${field_def.name}`;
    if (!block[dc_key]) {
      block[dc_key] = new DataChannel;
    }

    const c = <field_def.type field={block[field_def.name]} field_definition={field_def} data_channel={block[dc_key]} />;

    return (
      <div>
        <h4>{field_def.description || field_def.name}</h4>
        {c}
      </div>
    );
  }


  mk_wrapped_subcomponent(block, field_def) {
    return (
      <div class="wrapped-subcomponent" style={subblock_styles}>
        <h3 style={{ marginBottom: '0.6rem' }}>{field_def.description || field_def.name}</h3>
        {this.get_components(block)}
      </div>
    );
  }


  mk_wrapped_repeater(arr, field_def) {
    const items = arr || [ ];
    return (
      <div class="wrapped-repeater" style={subblock_styles}>
        <h3 style={{ marginBottom: '0.6rem' }}>{field_def.description || field_def.name}</h3>
        {items.map(item => this.mk_wrapped_subcomponent(item))}
      </div>
    );
  }


  get_components(block) {
    const block_def = get_block_def(block);
    return block_def.reduce((accum, field_def) => {
      if (!field_def.type) { throw Error(Err__FieldNoType()); }
      if (!field_def.name) { throw Error(Err__FieldNoName()); }

      const field = block[field_def.name];
      let out = null;

      if (field_def.type === 'sub-block') {
        out = this.mk_wrapped_subcomponent(block[field_def.name], field_def);
      }

      else if (field_def.type === 'sub-block array') {
        out = this.mk_wrapped_repeater(block[field_def.name], field_def);
      }

      else {
        out = this.mk_field(block, field_def);
      }

      accum.push(out);
      return accum;
    }, [ ]);
  }


  render() {
    const block = this.props.block;

    // <DnD.DragDropContext>
    //   <DnD.Droppable droppableId="droppable">{(provided, snapshot) => (
    //     <div>
    //     </div>
    //   )}</DnD.Droppable>
    // </DnD.DragDropContext>

    const components = this.get_components(block);

    return (
      <div style={{ marginBottom: '1rem' }}>
        <h3>{block.__type}</h3>
        {components}
      </div>
    );
  }

}

