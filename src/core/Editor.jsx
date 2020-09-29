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


// PageDataContext object
// -----------------------------------
// - provides back-communication interface
// - we break this out from the editor component just to make the interface clearer
//   provided

function ctx(pb_instance) {
  return {
    value_updated() {
      pb_instance.do_save_on_input();
    },

    should_redraw() {
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

    blocks: { },
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
      previous_load_state: null,
    };

    this.ctx = ctx(this);
    this.repeaters = { };
    this.previous_load_state = null;

    this.save             = this.save.bind(this);
    this.do_save_on_input = this.do_save_on_input.bind(this);
    this.cb_reorder       = this.cb_reorder.bind(this);
  }


  // block_toggled
  // -----------------------------------

  block_toggled() {
    this.props.delegate &&
      this.props.delegate.block_toggled &&
      this.props.delegate.block_toggled();
  }


  // to_data_blocks - convert render blocks back to data blocks, for save
  // -----------------------------------

  to_data_blocks() {
    function get_block(render_block) {
      const field_names = Object.keys(render_block.field_data)
        .filter(f => render_block.field_data[f].__display !== false);

      return field_names.reduce((carry, field_name) => {
        const item = render_block.field_data[field_name];
        const def = item.field_def;

        if (def.type === Fields.SubBlock) {
          if (Utils.subblock_is_enabled(item)) {
            carry[field_name] = get_block(item.value);
          }
        }

        else if (def.type === Fields.SubBlockArray) {
          carry[field_name] = (item.value || [ ]).map(get_block);
        }

        else {
          carry[field_name] = item.value;
        }

        if (carry[field_name] === '' || carry[field_name] === null || carry[field_name] === undefined) {
          delete carry[field_name];
        }

        return carry;
      }, { __type: render_block.block.type });
    }

    return (this.state.render_blocks || []).map(get_block);
  }


  // add_repeater_item()
  // -----------------------------------

  add_repeater_item(repeater_uid, block) {
    const repeater = this.repeaters[repeater_uid];
    if (repeater) {
      const render_block = this.create_render_block(block, [ ]);
      console.log('add_repeater_item created render_block:', render_block);
      repeater.value.push(render_block);
      this.ctx.value_updated();
      this.ctx.should_redraw();
      this.ctx.block_toggled();
    }
  }


  // remove_repeater_item()
  // -----------------------------------

  remove_repeater_item(repeater_uid, item_uid) {
    const repeater = this.repeaters[repeater_uid];
    if (repeater) {
      repeater.value = repeater.value.filter(item => item.__uid !== item_uid);
      this.ctx.value_updated();
      this.ctx.should_redraw();
      this.ctx.block_toggled();
    }
  }


  // add_block()
  // -----------------------------------

  add_block(type, at_index) {
    const render_blocks = this.state.render_blocks;
    const block = Utils.find_block(this.ctx.blocks, type);
    if (!block) {
      throw Error(Utils.Err__BlockTypeNotFound(type));
    }

    const b = this.create_render_block(block, [ ], true);

    if (typeof at_index === 'number') {
      render_blocks.splice(at_index, 0, b);
    }
    else {
      render_blocks.push(b);
    }

    this.setState({ render_blocks });
    setTimeout(() => {
      this.ctx.value_updated();
      this.ctx.should_redraw();
      this.ctx.block_toggled();
    });
  }


  // remove_block()
  // -----------------------------------

  remove_block(block_uid) {
    const render_blocks = this.state.render_blocks.filter(
      render_block => render_block.__uid !== block_uid
    );
    this.setState({ render_blocks });
    setTimeout(() => {
      this.ctx.value_updated();
      this.ctx.should_redraw();
      this.ctx.block_toggled();
    });
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
      const render_blocks = this.state.render_blocks;
      const [item] = render_blocks.splice(drag_result.source.index, 1);
      render_blocks.splice(drag_result.destination.index, 0, item);

      this.setState({ });
    }

    else if (is_repeater_reorder) {
      const repeater_field = this.repeaters[drag_result.source.droppableId];
      if (repeater_field) {
        const arr = repeater_field.value;
        const [item] = arr.splice(drag_result.source.index, 1);
        arr.splice(drag_result.destination.index, 0, item);

        this.setState({ });
      }
    }

    this.do_save_on_input();
  }


  // block picker
  // -----------------------------------

  set_block_picker(open) {
    this.setState({
      block_picker:        open,
      block_picker_offset: window.scrollY,
    });
    this.block_toggled();
  }


  // save
  // -----------------------------------

  do_save_on_input() {
    if (this.props.save === Save.OnInput) {
      this.save();
    }
  }

  save() {
    const data = this.to_data_blocks();
    this.props.delegate &&
      this.props.delegate.save &&
      this.props.delegate.save(data);
  }


  // render()
  // -----------------------------------

  render() {
    let content__main;
    let content__picker;

    const load_state   = this.props.load_state;
    const when_to_save = this.props.save   || Save.WhenSaveButtonClicked;
    const data         = this.props.data   || [ ];
    this.ctx.blocks    = this.props.blocks || [ ];
    Utils.set_uids(data);

    const show_block_picker = (
      load_state === State.Loaded &&
      this.state.block_picker !== false &&
      Utils.blocks_are_grouped(this.ctx.blocks)
    );

    function msg_div(msg) {
      return <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>{msg}</div>;
    }

    if (load_state === State.Error || !load_state) {
      content__main = msg_div(`Error loading post data`);
    }

    else if (load_state === State.Loading) {
      content__main = msg_div(`Loading...`);
    }

    else if (load_state === State.Loaded) {
      const n_blocks   = data.length;
      const min_height = this.state.block_picker === false ? '20rem' : '50rem';

      if (this.previous_load_state !== State.Loaded) {
        this.block_toggled();
      }

      content__main = (
        <div className="container" style={{ minHeight: min_height }}>

          {when_to_save === Save.WhenSaveButtonClicked && (
            <div className="save-button" style={{ margin: '1rem' }}>
              <a className="button" onClick={this.save}>Save</a>
            </div>
          )}

          <DnD.DragDropContext onDragEnd={this.cb_reorder}>
            <DnD.Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>
                {data.map((data_item, index) => <Block data_item={data_item} index={index} />)}
                {prov.placeholder}
              </div>
            )}</DnD.Droppable>
          </DnD.DragDropContext>

          <div className="is-flex" style={{ justifyContent: 'center' }}>
            <AddBlockBtn blocks={this.props.blocks}
                         block_index={data.length}
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
        <div className="post-builder" style={{ padding: '2rem', position: 'relative' }}>
          {content__main}

          {show_block_picker && <BlockPicker blocks={this.props.blocks}
                                             block_index={this.state.block_picker}
                                             scroll_offset={this.state.block_picker_offset}
                                             iframe_container_info={this.props.iframe_container_info || { }} />}
        </div>
      </PageDataContext.Provider>
    );
  }

}

