//
// PostBuilder - top level component, retrieves post data and kicks off rendering
//

import React from 'react';
import * as DnD from 'react-beautiful-dnd';
// import * as utils from '../utils';
import Block from './Block';
import AddBlockBtn from './AddBlockBtn';
import PageDataContext from './PageDataContext';
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
// - passed to PageDataContext as {value}
// - provides interface to update page_data blocks (calls setState on PostBuilder)

function context_obj(pb_instance) {
  return {
    should_update() {
      setTimeout(() => pb_instance.setState({ }), 10);
    },

    add_repeater_item(repeater_uid, type) {
      pb_instance.add_repeater_item(repeater_uid, type);
    },

    remove_repeater_item(repeater_uid, item_uid) {
      pb_instance.remove_repeater_item(repeater_uid, item_uid);
    },

    add_block(type, index) {
      pb_instance.add_block(type, index);
    },

    remove_block(block_uid) {
      pb_instance.remove_block(block_uid);
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
    };

    this.i = 0;
    this.context_obj = context_obj(this);
    this.repeaters = { };
    this.supported_blocks = component_definitions.get_all().reduce((accum, t) => {
      accum[t] = component_definitions.get(t);
      return accum;
    }, { });
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
    return `uid-${this.i++}`;
  }


  // create_render_block
  // -----------------------------------
  // - create a 'render block' item given a block definition and an
  //   optional data_block of existing data

  create_render_block(block_definition, data_block) {
    const render_block = {
      type: block_definition.type,
      def: block_definition,
      uid: this.uid.call(this),
      fields: block_definition.reduce((accum, field_def) => {
        const field = {
          uid: this.uid.call(this),
          def: field_def,
          value: null,
        };

        if (!field_def) {
          console.log('error: field_def not found', field, data_block, block_definition);
        }

        if (field_def.type === 'subblock') {
          const sub_data_block = (data_block && data_block[field_def.name]) || null;
          field.value = this.create_render_block(
            field_def.subblock_type,
            sub_data_block
          );
        }

        else if (field_def.type === 'subblock array') {
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
    function datablock_arr_to_renderblock_arr(arr_blocks) {
      return arr_blocks.map(b => {
        return this.create_render_block(component_definitions.get(b.__type), b);
      });
    }

    const render_data = datablock_arr_to_renderblock_arr.call(this, page_data)
    render_data.forEach(b => b.is_top_level = true);

    return render_data;
  }


  // add_repeater_item()
  // -----------------------------------

  add_repeater_item(repeater_uid, type) {
    const repeater = this.repeaters[repeater_uid];
    if (repeater) {
      const item = this.create_render_block(type, null);
      repeater.value.push(item);
      this.context_obj.should_update();
    }
  }


  // remove_repeater_item()
  // -----------------------------------

  remove_repeater_item(repeater_uid, item_uid) {
    const repeater = this.repeaters[repeater_uid];
    if (repeater) {
      repeater.value = repeater.value.filter(item => item.uid !== item_uid);
      this.context_obj.should_update();
    }
  }


  // add_block()
  // -----------------------------------

  add_block(type, index) {
    const b = this.create_render_block(component_definitions.get(type));
    b.is_top_level = true;
    if (typeof index === 'number') {
      this.state.render_data.splice(index, 0, b);
    }
    else {
      this.state.render_data.push(b);
    }

    this.context_obj.should_update();
  }


  // remove_block()
  // -----------------------------------

  remove_block(block_uid) {
    this.setState({ render_data: this.state.render_data.filter(block => block.uid !== block_uid) });
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
    let inner;

    if (this.state.error) {
      inner = (
        <div className="bg-solid">
          Couldn’t load post data
        </div>
      );
    }

    else if (!this.state.loaded) {
      inner = (
        <div className="bg-solid">
          Loading...
        </div>
      );
    }

    else {
      const render_data = this.state.render_data;
      const n_blocks = render_data.length;
      inner = (
        <div className="container" style={{ minHeight: '15rem' }}>
          <PageDataContext.Provider value={this.context_obj}>
            <DnD.DragDropContext onDragEnd={this.cb_reorder.bind(this)}>
              <DnD.Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
                <div ref={prov.innerRef} {...prov.droppableProps}>

                  {render_data.map((block, index) => (
                    <DnD.Draggable key={`block-${block.uid}`} draggableId={`block-${block.uid}`} index={index} type="block">{(prov, snap) => (

                      <div className="block-list-item" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={block_drag_styles(snap, prov)}>
                        <Block block={block} block_index={index} context_obj={this.context_obj} supported_blocks={this.supported_blocks} />
                      </div>

                    )}</DnD.Draggable>
                  ))}

                  {prov.placeholder}

                </div>
              )}</DnD.Droppable>
            </DnD.DragDropContext>
          </PageDataContext.Provider>

          <div className="is-flex" style={{ justifyContent: 'center' }}>
            <AddBlockBtn cb_select={(ev, type) => this.context_obj.add_block(type, null)} items={this.supported_blocks} popup_direction={n_blocks ? 'up' : 'down'}  />
          </div>
        </div>
      );
    }

    return (
      <div className="post-builder" style={{ padding: '2rem' }}>
        {inner}
      </div>
    );
  }

}

