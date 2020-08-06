import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import Block from './Block';
import AddBlockBtn from './other/AddBlockBtn';
import BlockPicker from './other/BlockPicker';
import PageDataContext from './PageDataContext';
import Fields from './fields';
import Utils from './definitions/utils';
import State from './definitions/state';
import Save from './definitions/save';


function block_drag_styles(snapshot, provided) {
  const custom_styles = snapshot.isDragging ? {
    backgroundColor: 'rgba(0,0,255, 0.06)',
    border: '3px solid rgba(0,0,255, 0.12)',
  } : { };

  return { ...custom_styles, ...provided.draggableProps.style };
}


// PageDataContext object
// -----------------------------------
// - provides back-communication interface
// - we break this out from the editor component just to make the interface clearer
//   provided

function ctx(pb_instance) {
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

    block_toggled() {
      pb_instance.block_toggled();
    },

    open_block_picker(block_index) {
      pb_instance.set_block_picker(block_index);
    },

    close_block_picker() {
      pb_instance.set_block_picker(false);
    },

    blockset: { },
  };
}


// Editor component
// -----------------------------------

export default class Editor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      render_blocks: null,
      block_picker: false,
    };

    this.i = 0;
    this.ctx = ctx(this);
    this.repeaters = { };
  }


  // uid()
  // -----------------------------------

  uid() {
    return `uid-${this.i++}`;
  }


  // block_toggled
  // -----------------------------------

  block_toggled() {
    this.props.delegate &&
      this.props.delegate.block_toggled &&
      this.props.delegate.block_toggled();
  }


  // create_render_block
  // -----------------------------------
  // - create a 'render block' item from  a block definition and an optional
  //   data_block of existing data
  // - a 'render block' is a combination of block data and component definitions
  //   that's more convenient for rendering:
  //     {
  //       type: type name,
  //       def:  component definition for block
  //       uid:  a unique ID
  //       fields: {
  //         field_name: {
  //           uid:    a unique ID,
  //           def:    field definition from component definition
  //           value:  field value - may be a normal value, a subblock, or an array of subblocks
  //         },
  //         ...
  //       }
  //     }

  create_render_block(definition, data_block) {
    const render_block = {
      type: definition.type,
      def: definition,
      uid: this.uid.call(this),
      fields: definition.fields.reduce((accum, def) => {
        const field = {
          uid: this.uid.call(this),
          value: null,
          def,
        };

        if (!def) {
          console.log('create_render_block error: no field definition', field, data_block, definition);
          return accum;
        }

        if (def.type === Fields.SubBlock) {
          const sub_data_block = (data_block && data_block[def.name]) || null;
          if (def.optional) {
            field.enabled = !!sub_data_block;
          }
          field.value = this.create_render_block(
            def.subblock_type,
            sub_data_block
          );
        }

        else if (def.type === Fields.SubBlockArray) {
          const sub_data_blocks = (data_block && data_block[def.name]) || [ ];
          field.value = sub_data_blocks.map(block => this.create_render_block(
            this.ctx.blockset.get(block.__type),
            block
          ));

          this.repeaters[field.uid] = field;
        }

        else {
          field.value = data_block && data_block[def.name];
        }

        accum[def.name] = field;
        return accum;
      }, { }),
    };

    return render_block;
  }


  // get_render_blocks - convert loaded data to 'render blocks'
  // -----------------------------------

  get_render_blocks(page_data) {
    const render_blocks = page_data.map(block => this.create_render_block(
      this.ctx.blockset.get(block.__type),
      block
    ));

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

        if (field.def.type === Fields.SubBlock) {
          if (Utils.subblock_is_enabled(field)) {
            accum[field_name] = get_block(field.value);
          }
        }

        else if (field.def.type === Fields.SubBlockArray) {
          accum[field_name] = field.value.map(get_block);
        }

        else {
          accum[field_name] = field.value;
        }

        if (accum[field_name] === '' || accum[field_name] === null || accum[field_name] === undefined) {
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
      this.ctx.should_update();
    }
  }


  // remove_repeater_item()
  // -----------------------------------

  remove_repeater_item(repeater_uid, item_uid) {
    const repeater = this.repeaters[repeater_uid];
    if (repeater) {
      repeater.value = repeater.value.filter(item => item.uid !== item_uid);
      this.ctx.should_update();
    }
  }


  // add_block()
  // -----------------------------------

  add_block(type, index) {
    const b = this.create_render_block(this.ctx.blockset.get(type));
    b.is_top_level = true;
    if (typeof index === 'number') {
      this.state.render_blocks.splice(index, 0, b);
    }
    else {
      this.state.render_blocks.push(b);
    }

    this.ctx.should_update();
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
        arr.splice(drag_result.destination.index, 0, item);

        this.setState({ render_blocks: this.state.render_blocks });
      }
    }
  }


  // block picker
  // -----------------------------------

  set_block_picker(open) {
    this.setState({ block_picker: open });
    this.block_toggled();
  }


  // save
  // -----------------------------------

  save() {
    const data = this.get_plain_data();
    this.props.delegate &&
      this.props.delegate.save &&
      this.props.delegate.save(data);
  }


  // render()
  // -----------------------------------

  render() {
    let content__main;
    let content__picker;

    const load_state = this.props.load_state;
    const when_to_save = this.props.save;
    this.ctx.blockset = this.props.blockset;

    function msg_div(msg) {
      return <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>{msg}</div>;
    }

    if (load_state === State.Error) {
      content__main = msg_div(`Couldn’t load post data`);
    }

    else if (load_state === State.Loading) {
      content__main = msg_div(`Loading...`);
    }

    else if (load_state === State.Loaded) {
      let render_blocks = this.state.render_blocks;
      if (!render_blocks) {
        this.state.render_blocks = render_blocks = this.get_render_blocks(this.props.data);
      }

      if (when_to_save === Save.OnInput) {
        this.save.call(this);
      }

      const n_blocks = render_blocks.length;
      const min_height = this.state.block_picker ? '50rem' : '20rem';
      content__main = (
        <div className="container" style={{ minHeight: min_height }}>

          {when_to_save === Save.WhenSaveButtonClicked && (
            <div style={{ margin: '1rem' }}>
              <a className="button" onClick={_ => this.save.call(this)}>Save</a>
            </div>
          )}

          <DnD.DragDropContext onDragEnd={this.cb_reorder.bind(this)}>
            <DnD.Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>

                {render_blocks.map((block, index) => (
                  <DnD.Draggable key={`block-${block.uid}`} draggableId={`block-${block.uid}`} index={index} type="block">{(prov, snap) => (

                    <div className="block-list-item" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={block_drag_styles(snap, prov)}>
                      <Block block={block} block_index={index} ctx={this.ctx} />
                    </div>

                  )}</DnD.Draggable>
                ))}

                {prov.placeholder}

              </div>
            )}</DnD.Droppable>
          </DnD.DragDropContext>

          <div className="is-flex" style={{ justifyContent: 'center' }}>
            <AddBlockBtn blocks={this.props.blockset}
                         block_index={render_blocks.length}
                         cb_select={block_type => this.ctx.add_block(block_type, null)}
                         suggest={n_blocks === 0}
                         popup_direction={n_blocks ? 'up' : 'down'} />
          </div>

        </div>
      );
    }

    else {
      content__main = msg_div(`Unknown load state: ${load_state}`);
    }

    return (
      <PageDataContext.Provider value={this.ctx}>
        <div className="post-builder" style={{ padding: '2rem' }}>
          {content__main}
          {
            load_state === State.Loaded &&
            this.state.block_picker !== false &&
            Utils.blocks_are_grouped(this.ctx.blockset) &&
            <BlockPicker blocks={this.props.blockset} block_index={this.state.block_picker} />
          }
        </div>
      </PageDataContext.Provider>
    );
  }

}

