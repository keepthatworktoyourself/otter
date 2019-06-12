//
// PostBuilder - top level component, retrieves post data and kicks off rendering
//

import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import { get_random_int } from '../utils';
import BlockList from './BlockList';
import Components from '../component-mapping';
import Context__PageData from './Context__PageData';


// context_data_provider
// -----------------------------------
// - passed to Context__PageData as value
// - provides interface to update page_data blocks (calls setState on PostBuilder)

function context_data_provider(pb_instance) {
  const exp = {
    page_data() {
      return pb_instance.state.page_data;
    },

    should_update() {
      pb_instance.do_update();
    },

    // move_block(from, to) {
    //   const prev_data = pd_copy();
    //   const block_to_move = prev_data[from];
    //   const page_data = prev_data.splice(from, 1).splice(to, 0, block_to_move);
    //   pb_instance.setState({ page_data });
    // },
  };

  function pd_copy() {
    return Object.assign({}, exp.page_data());
  }

  return exp;
}



// PostBuilder
// -----------------------------------

export default class PostBuilder extends React.Component {

  constructor(props) {
    super(props);

    // this.onDragEnd = this.onDragEnd.bind(this);
    // this.setFieldData = this.setFieldData.bind(this);

    this.state = {
      loaded:      false,
      error:       false,
      page_data:   [ ],
      // toggleMenu:  this.toggleMenu.bind(this),
      // addBlock:    this.addBlock.bind(this),
      // deleteBlock: this.deleteBlock.bind(this),
      // onChange:    this.onChange.bind(this),
      cb_load:     this.cb_load.bind(this),
    };

    this.context_obj = context_data_provider(this);
  }


  // Init
  // -----------------------------------

  componentDidMount() {
    if (!this.props.post_id) {
      console.log('Not getting data, no post id');
      return;
    }

    fetch(`http://localhost/wp-content/themes/brandwatch/temp-backend.php?post_id=${this.props.post_id}`)
      .then(response => response.json())
      .then(this.state.cb_load)
      .catch(err => this.state.cb_load(false));
  }


  // cb_load
  // -----------------------------------

  cb_load(data) {
    if (!data) {
      this.setState({ error: true });
      return;
    }

    this.setState({
      loaded: true,
      page_data: JSON.parse(data.data) || [ ],
    });
  }



  // do_update() - update by traversing blocks
  // -----------------------------------

  do_update() {
    const page_data = Object.assign([ ], this.state.page_data);
    console.log(page_data);

    function update_block(block) {
      // Update regular fields via their data channels
      Object.keys(block).filter(k => k.match(/^__field__/))
        .forEach(__datachannel_key => {
          const key = __datachannel_key.replace(/^__field__/, '');
          const data_channel = block[__datachannel_key];

          console.log(data_channel);
          block[key] = data_channel.get();
          console.log(block[key]);
        });

      // Update subblocks
      function is_subobject(item) { return item && item.constructor === Object && item.hasOwnProperty('__type'); }
      Object.keys(block).filter(k => is_subobject(block[k]))
        .forEach(k => update_block(block[k]));

      // // Update subblock arrays
      // Object.keys(block).filter(k => (k.constructor === Array));
    }

    page_data.forEach(update_block);

    this.setState(page_data);

    // function get_fields(block) {
    //
    //
    //   // Sub-objects
    //
    //   const sub_object_fields = Object.keys(block).filter(k => is_subobject(block[k]))
    //     .map(k => { console.log(k, block[k]); return get_fields(block[k]); });
    //
    //   return [
    //     fields,
    //
    //   ]
    //
    //   console.log(sub_object_fields);
    // }
    //
    // const f = page_data.map(get_fields);
    // console.log(f);
  }




  // // Context__PageData functions
  // // -----------------------------------
  //
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
  // // onChange()
  // // -----------------------------------
  // onChange = (event, blockId, field) => {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   var newState = {
  //     blocks: {...this.state.blocks},
  //   };
  //   newState.blocks[blockId] = {...this.state.blocks[blockId]};
  //   newState.blocks[blockId][field] = value;
  //   this.setState(newState);
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
  //
  //
  // // getDefaultValue()
  // // -----------------------------------
  // getDefaultValue(field) {
  //   if (field.type == 'Select') {
  //     return field.options[0];
  //   }
  //
  //   if (field.type == 'Switch') {
  //     return false;
  //   }
  //
  //   return '';
  // }
  //
  //
  // // setFieldData()
  // // -----------------------------------
  // setFieldData(fields, block) {
  //   Object.values(fields).map((field) => {
  //     const def_value = this.getDefaultValue(field.type);
  //     block[field.acf_key] = def_value;
  //   });
  //   return block;
  // }
  //
  //
  // // toggleMenu()
  // // -----------------------------------
  // toggleMenu = () => {
  //   const menu = document.getElementById('block-menu');
  //   if (menu.classList.contains("dn")) {
  //     menu.classList.remove("dn");
  //   }
  //   else {
  //     menu.classList.add("dn");
  //   }
  // }


  // render()
  // -----------------------------------

  render() {
    if (this.state.error) {
      return `Couldn't load post data`;
    }

    if (!this.state.loaded) {
      return `Loading...`;
    }

    return (
      <Context__PageData.Provider value={this.context_obj}>
        <DnD.DragDropContext>
          <div>
            <h1 className="title is-1 has-text-grey-dark">{this.props.title}</h1>

            <DnD.Droppable droppableId="droppable">{(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <BlockList />
                {provided.placeholder}
              </div>
            )}</DnD.Droppable>
          </div>
        </DnD.DragDropContext>
      </Context__PageData.Provider>
    );
  }

}

