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
      loaded:         false,
      error:          false,
      no_post_to_get: false,
      render_blocks:  null,
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
      this.setState({ no_post_to_get: true });
      return;
    }

    this.load();
  }


  // load
  // -----------------------------------

  load() {
    const base_url = `http://localhost/wp-content/themes/brandwatch/`;
    const url = `${base_url}temp-backend.php?post_id=${this.props.post_id}`;
    fetch(url)
      .then(response => response.json())
      .catch(err => this.cb_load(false))
      .then(data => this.cb_load(data))
      .catch(err => { console.log(err); this.cb_load(false); });
  }


  // save
  // -----------------------------------

  save() {
    const url = `http://localhost/wp-content/themes/brandwatch/temp-backend--save.php`;
    const data = this.get_plain_data();
    console.log(data);
    console.log(JSON.stringify(data));
    const post_content = (
      `post_id=${this.props.post_id}&` +
      `data=${encodeURIComponent(JSON.stringify(data))}`
    );

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: post_content,
    }).then(response => console.log(response.json()));
  }


  // cb_load
  // -----------------------------------

  cb_load(data) {
    if (!data) {
      this.setState({ error: true });
      return;
    }

    const page_data = JSON.parse(data.data) || [ ];
    const render_blocks = this.get_render_blocks(page_data);

    this.setState({
      loaded: true,
      render_blocks,
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
  // - a 'render block' is a combination of block data and component definitions
  //   that's more convenient for rendering:
  //     {
  //       type: type name,
  //       def:  component definition for block
  //       uid:  a unique ID
  //       fields: {
  //         field_name: {
  //           uid:    a unique ID,
  //           def:    field definition withing component definition
  //           value:  field value - may be a normal value, a subblock, or an array of subblocks
  //         }
  //         ...
  //       }
  //     }


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
          return accum;
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


  // get_render_blocks - convert loaded data to 'render blocks' (more useful)
  // -----------------------------------

  get_render_blocks(page_data) {
    function datablock_arr_to_renderblock_arr(arr_blocks) {
      return arr_blocks.map(b => {
        return this.create_render_block(component_definitions.get(b.__type), b);
      });
    }

    const render_blocks = datablock_arr_to_renderblock_arr.call(this, page_data)
    render_blocks.forEach(b => b.is_top_level = true);

    return render_blocks;
  }


  // get_plain_data - convert render blocks back to block data, for export
  // -----------------------------------

  get_plain_data() {
    function get_block(render_block) {
      const fields = Object.keys(render_block.fields).filter(f => render_block.fields[f].should_display !== false);

      const block = fields.reduce((accum, field_name) => {
        const field = render_block.fields[field_name];

        if (field.def.type === 'subblock') {
          accum[field_name] = get_block(field.value);
        }

        else if (field.def.type === 'subblock array') {
          accum[field_name] = field.value.map(get_block);
        }

        else {
          accum[field_name] = field.value;
        }

        if (accum[field_name] === '' || accum[field_name] === null) {
          delete accum[field_name];
        }

        return accum;
      }, { });

      block.__type = render_block.def.type;
      return block;
    }

    return this.state.render_blocks.map(get_block);
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
      this.state.render_blocks.splice(index, 0, b);
    }
    else {
      this.state.render_blocks.push(b);
    }

    this.context_obj.should_update();
  }


  // remove_block()
  // -----------------------------------

  remove_block(block_uid) {
    this.setState({ render_blocks: this.state.render_blocks.filter(block => block.uid !== block_uid) });
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
      const d = this.state.render_blocks;

      const [item] = d.splice(drag_result.source.index, 1);
      d.splice(drag_result.destination.index, 0, item);

      this.setState({ render_blocks: d });
    }

    else if (is_repeater_reorder) {
      const repeater_field = this.repeaters[drag_result.source.droppableId];
      if (repeater_field) {
        const arr = repeater_field.value;
        const [item] = arr.splice(drag_result.source.index, 1);
        arr.splice(drag_result.destination.idnex, 0, item);

        this.setState({ render_blocks: this.state.render_blocks });
      }
    }
  }


  // render()
  // -----------------------------------

  render() {
    let inner;

    function msg_div(msg) {
      return <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>{msg}</div>;
    }

    if (this.state.error) {
      inner = msg_div(`Couldn’t load post data`);
    }
    else if (this.state.no_post_to_get) {
      inner = msg_div(`No post specified!`);
    }
    else if (!this.state.loaded) {
      inner = msg_div(`Loading...`);
    }
    else {
      const render_blocks = this.state.render_blocks;
      const n_blocks = render_blocks.length;
      inner = (
        <div className="container" style={{ minHeight: '15rem' }}>
          <div style={{ margin: '1rem' }}>
            <a className="button" onClick={_ => this.save.call(this)}>Save</a>
          </div>

          <PageDataContext.Provider value={this.context_obj}>
            <DnD.DragDropContext onDragEnd={this.cb_reorder.bind(this)}>
              <DnD.Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
                <div ref={prov.innerRef} {...prov.droppableProps}>

                  {render_blocks.map((block, index) => (
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

