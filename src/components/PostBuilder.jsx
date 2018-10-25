//
// PostBuilder - top level component, retrieves post data and kicks off rendering
//

import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import * as utils from '../utils';
import Block from './Block';
import Context__PageData from './Context__PageData';
import component_definitions from '../component-mapping';


function block_drag_styles(snapshot, provided) {
  const custom_styles = snapshot.isDragging ? {
    backgroundColor: 'rgba(0,0,255, 0.06)',
    border: '3px solid rgba(0,0,255, 0.12)',
  } : { };

  return { ...custom_styles, ...provided.draggableProps.style };
}


// context_obj
// -----------------------------------
// - passed to Context__PageData as {value}
// - provides interface to update page_data blocks (calls setState on PostBuilder)

function context_obj(pb_instance) {
  return {
    should_update() {
      pb_instance.setState({ });
    },

    add_repeater_item(repeater_uid, type) {
      pb_instance.add_repeater_item(repeater_uid, type);
    },
  };
}


// PostBuilder
// -----------------------------------

export default class PostBuilder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded:      false,
      error:       false,
      render_data: null,    // Data processed into more useful fmt for JS app
      i: 0,   // Used for generating unique IDs for fields/blocks (for DnD)
    };

    this.context_obj = context_obj(this);
    this.repeaters = { };
  }


  // Init
  // -----------------------------------

  componentDidMount() {
    if (!this.props.post_id) {
      console.log('Not getting data, no post id');
      return;
    }

    const load = this.cb_load.bind(this);

    const url = `http://localhost/wp-content/themes/brandwatch/temp-backend.php?` +
      `post_id=${this.props.post_id}`;
    fetch(url)
      .then(response => response.json())
      .catch(err => load(false))
      .then(this.cb_load.bind(this))
      .catch(err => { console.log(err); load(false); });
  }


  // cb_load
  // -----------------------------------

  cb_load(data) {
    if (!data) {
      this.setState({ error: true });
      return;
    }

    const page_data = JSON.parse(data.data) || [ ];
    const render_data = this.get_render_data(page_data);

    this.setState({
      loaded: true,
      render_data,
    });
  }


  // uid()
  // -----------------------------------

  uid() {
    return `uid-${this.state.i++}`;
  }


  // create_render_block
  // -----------------------------------
  // - create a 'render block' item given a block definition and an
  //   optional data_block of existing data

  create_render_block(block_definition, data_block) {
    const render_block = {
      type: block_definition.type,
      uid: this.uid.call(this),
      fields: block_definition.reduce((accum, field_def) => {
        const field = {
          uid: this.uid.call(this),
          def: field_def,
          value: null,
        };

        if (field_def.type === 'sub-block') {
          const sub_data_block = (data_block && data_block[field_def.name]) || null;
          field.value = this.create_render_block(
            field_def.subblock_type,
            sub_data_block
          );
        }

        else if (field_def.type === 'sub-block array') {
          const sub_data_blocks = (data_block && data_block[field_def.name]) || [ ];
          field.value = sub_data_blocks.map(b => this.create_render_block(
            component_definitions.get(b.__type),
            b
          ));

          this.repeaters[field.uid] = field;
        }

        else {
          field.value = data_block && data_block[field_def.name];
        }

        accum[field_def.name] = field;
        return accum;
      }, { }),
    };

    return render_block;
  }


  // get_render_data - convert loaded data to a more useful form
  // -----------------------------------

  get_render_data(page_data) {
    const self = this;

    function datablock_arr_to_renderblock_arr(arr_blocks) {
      return arr_blocks.map(b => {
        return self.create_render_block.call(self, component_definitions.get(
          b.__type), b
        );
      });
    }

    return datablock_arr_to_renderblock_arr(page_data);
  }


  // add_repeater_item()
  // -----------------------------------

  add_repeater_item(repeater_uid, type) {
    console.log('add_repeater_item', repeater_uid, type);
    const repeater = this.repeaters[repeater_uid];
    if (!repeater) {
      return;
    }

		const item = this.create_render_block(type, null);
		repeater.value.push(item);

		this.context_obj.should_update();
  }


  // cb_drag_end()
  // -----------------------------------

  cb_reorder(drag_result) {
    if (!drag_result.destination) {
      return;
    }
    if (drag_result.source.index === drag_result.destination.index) {
      return;
    }

    const is_block_reorder = (
      drag_result.destination.droppableId === 'd-blocks' &&
      drag_result.source.droppableId === 'd-blocks'
    );
    const is_repeater_reorder = !is_block_reorder;  // Condition may need tightening

    if (is_block_reorder) {
      const d = this.state.render_data;

      const [item] = d.splice(drag_result.source.index, 1);
      d.splice(drag_result.destination.index, 0, item);

      this.setState({ render_data: d });
    }

    else if (is_repeater_reorder) {
      const repeater_field = this.repeaters[drag_result.source.droppableId];
      if (repeater_field) {
        const arr = repeater_field.value;
        const [item] = arr.splice(drag_result.source.index, 1);
        arr.splice(drag_result.destination.idnex, 0, item);

        this.setState({ render_data: this.state.render_data });
      }
    }
  }


  // render()
  // -----------------------------------

  render() {
    if (this.state.error) {
      return `Couldn't load post data`;
    }

    if (!this.state.loaded) {
      return `Loading...`;
    }

    console.log(this.state.render_data);

    return (
      <div class="post-builder" style={{ padding: '1rem' }}>
        <Context__PageData.Provider value={this.context_obj}>
          <DnD.DragDropContext onDragEnd={this.cb_reorder.bind(this)}>
            <DnD.Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>

                {this.state.render_data.map((block, index) => (
                  <DnD.Draggable key={`block-${index}`} draggableId={`block-${index}`} index={index} type="block">{(prov, snap) => (

                    <div class="block-list-item" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={block_drag_styles(snap, prov)}>
                      <Block block={block} block_index={index} context_obj={this.context_obj}/>
                    </div>

                  )}</DnD.Draggable>
                ))}

                {prov.placeholder}

              </div>
            )}</DnD.Droppable>
          </DnD.DragDropContext>
        </Context__PageData.Provider>
      </div>
    );
  }

}


// // addBlock()
// // -----------------------------------
//
// addBlock = (ev, classNameString) => {
//   const key = "block-" + get_random_int(10000);
//   const block_fields = {};
//   const block_def = Components[classNameString];
//   let block = {};
//   block['__type_name'] = classNameString;
//
//   if (block_def.sections) {
//     Object.values(block_def.sections).map((section) => {
//       block = this.setFieldData(section.fields, block);
//     })
//   }
//   else {
//     block = this.setFieldData(block_def.fields, block);
//   }
//
//   this.setState(prevState => ({
//     blocks: {...prevState.blocks, [key]: block},
//     columns: {
//       ...prevState.columns,
//       'column-1': {
//         ...prevState.columns['column-1'],
//         blockIds: [...prevState.columns['column-1'].blockIds, key]
//       }
//     }
//   }));
//
//   document.getElementById('block-menu').classList.add("dn");
//
//   // TODO send state wherever needs to be used
// }
//
//
// // deleteBlock()
// // -----------------------------------
// deleteBlock = (event, blockId) => {
//   const blocks = this.state.blocks;
//   const blockIds = this.state.columns['column-1'].blockIds;
//   delete blocks[blockId];
//   blockIds.splice(blockIds.indexOf(blockId),1);
//
//   this.setState(prevState => ({
//     blocks: blocks,
//     columns: {
//       ...prevState.columns,
//       'column-1': {
//         ...prevState.columns['column-1'],
//         blockIds: blockIds,
//       }
//     }
//   }));
//
//   // TODO send state wherever needs to be used
//   setTimeout(() => { console.log(this.state) }, 3000);
// }
//
//
// // Drag & drop
// // -----------------------------------
//
// onDragEnd = result => {
//   const { destination, source, draggableId} = result;
//
//   if (!destination) {
//     return;
//   }
//
//   const has_moved = destination.droppableId !== source.droppableId || destination.index !== source.index;
//   if (!has_moved) {
//     return;
//   }
//
//   const column = this.state.columns[source.droppableId];
//   const newBlockIds = Array.from(column.blockIds);
//   // reorder the blockIds as those determine the order of blocks
//   // NOTE might require some extra work when sending data to db
//   // to ensure that the changes in order are reflected
//   newBlockIds.splice(source.index, 1);
//   newBlockIds.splice(destination.index, 0, draggableId);
//
//   const newColumn = {
//     ...column,
//     blockIds: newBlockIds,
//   };
//
//   // TODO reorder blocks not just blockIds
//
//   const newState = {
//     ...this.state,
//     columns: {
//       ...this.state.columns,
//       [newColumn.id]: newColumn,
//     },
//   };
//
//   this.setState(newState);
//
//   setTimeout(() => { console.log(this.state) }, 3000);
//   // TODO prepare data to be sent to db
//
//   // other syntax:
//   // this.setState(prevState => ({
//   //   columns: {...prevState.columns, [newColumn.id]: newColumn,
//   //   }
//   // }));
// }

