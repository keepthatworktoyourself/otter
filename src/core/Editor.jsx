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
    block_toggled() {
      pb_instance.block_toggled();
    },


    add_item(type, index) {
      pb_instance.add_item(type, index);
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
      block_picker: false,
    };

    this.ctx = ctx(this);
    this.repeaters = { };
    this.previous_load_state = null;

    this.save             = this.save.bind(this);
    this.do_save_on_input = this.do_save_on_input.bind(this);
    this.get_data         = this.get_data.bind(this);
    this.add_item         = this.add_item.bind(this);
    this.delete_item      = this.delete_item.bind(this);
    this.cb__reorder      = this.cb__reorder.bind(this);
  }


  // block_toggled
  // -----------------------------------

  block_toggled() {
    this.props.delegate && this.props.delegate.block_toggled && this.props.delegate.block_toggled();
  }


  // get_data - export data for save
  // -----------------------------------

  get_data() {
    function export_data_item(data_item, blocks) {
      if (!data_item) {
        return null;
      }

      const block = Utils.find_block(blocks, data_item.__type);
      if (!block) {
        return null;
      }

      const fields__displayed = (block.fields || []).filter(field_def => {
        const di = Utils.display_if(block, field_def.name, data_item);
        return di.display === true;
      });

      return fields__displayed.reduce((carry, field_def) => {
        const field_name  = field_def.name;
        const field_type  = field_def.type;
        const field_value = data_item[field_name];

        if (field_type === Fields.NestedBlock || field_type === Fields.Repeater) {
          const include = !field_def.optional || Utils.optional_nested_block__is_enabled(field_name, data_item);
          if (include) {
            carry[field_name] = field_type === Fields.NestedBlock ?
              export_data_item(field_value, blocks) :
              (field_value || [ ]).map(item => export_data_item(item, blocks));
          }
        }

        else {
          carry[field_name] = field_value;
        }

        const remove = (
          carry[field_name] === '' ||
          carry[field_name] === null ||
          carry[field_name] === undefined ||
          carry[field_name].constructor === Array && carry[field_name].length === 0 ||
          Utils.is_data_item(carry[field_name]) && !Utils.item_has_data(carry[field_name]) ||
          field_name.match(/^__/)
        );
        if (remove) {
          delete carry[field_name];
        }

        return carry;
      }, { __type: block.type });
    }

    return (this.props.data || []).map(item => export_data_item(item, this.props.blocks));
  }


  // add_item()
  // -----------------------------------

  add_item(type, index) {
    const data_item = { __type: type };

    if (typeof index === 'number') {
      this.props.data.splice(index, 0, data_item);
    }
    else {
      this.props.data.push(data_item);
    }

    this.setState({ });

    this.ctx.value_updated();
    this.ctx.should_redraw();
    this.ctx.block_toggled();
  }


  // delete_item
  // -----------------------------------

  delete_item(index) {
    this.props.data.splice(index, 1);

    this.setState({ });

    this.ctx.value_updated();
    this.ctx.should_redraw();
    this.ctx.block_toggled();
  }


  // cb__reorder
  // -----------------------------------

  cb__reorder(drag_result) {
    if (!drag_result.destination || !drag_result.source) {
      return;
    }
    if (drag_result.source.index === drag_result.destination.index) {
      return;
    }

    const data_items = this.props.data;
    const [item] = data_items.splice(drag_result.source.index, 1);
    data_items.splice(drag_result.destination.index, 0, item);

    this.setState({ });
    this.ctx.value_updated();
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
    const data = this.get_data();
    this.props.delegate &&
      this.props.delegate.save &&
      this.props.delegate.save(data);
  }


  // data: generate uids
  // -----------------------------------

  static ensure_uids(data) {
    Utils.iterate_data(data, (data_item) => {
      if (data_item && !data_item.__uid) {
        data_item.__uid = Utils.uid();
      }
    });
  }


  // render()
  // -----------------------------------

  render() {
    const data_items      = this.props.data || [ ];
    const blocks          = this.props.blocks || [ ];
    const load_state      = this.props.load_state;
    const when_to_save    = this.props.save || Save.OnClick;
    const DragDropContext = this.props.drag_context_component || DnD.DragDropContext;
    const Droppable       = this.props.droppable_component    || DnD.Droppable;
    const ContextProvider = this.props.provider_component     || PageDataContext.Provider;
    const BlockStub       = this.props.block_component        || Block;
    const show_block_picker = (
      load_state === State.Loaded &&
      this.state.block_picker !== false &&
      Utils.blocks_are_grouped(blocks)
    );


    let content__main;
    let content__picker;

    this.ctx.blocks = blocks;
    Editor.ensure_uids(data_items);


    const msg_div = (msg) =>
      <div className="otter-load-error bg-solid has-text-centered" style={{ padding: '1rem' }}>
        {msg}
      </div>;


    if (load_state === State.Error || !load_state) {
      content__main = msg_div(`Error loading post data`);
    }

    else if (load_state === State.Loading) {
      content__main = msg_div(`Loading...`);
    }

    else if (load_state === State.Loaded) {
      const min_height = this.state.block_picker === false ? '20rem' : '50rem';

      if (this.previous_load_state !== State.Loaded) {
        this.block_toggled();
      }

      content__main = (
        <div className="container" style={{ minHeight: min_height }}>

          {when_to_save === Save.OnClick && (
            <div className="save-button" style={{ margin: '1rem' }}>
              <a className="button" onClick={this.save}>Save</a>
            </div>
          )}

          <DragDropContext onDragEnd={this.cb__reorder}>
            <Droppable droppableId="d-blocks" type="block">{(prov, snap) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>

                {data_items.map((data_item, index) =>
                  <BlockStub key={data_item.__uid} data_item={data_item} index={index} cb__delete={this.delete_item} />
                )}

                {prov.placeholder}

              </div>
            )}</Droppable>
          </DragDropContext>

          <div className="is-flex" style={{ justifyContent: 'center' }}>
            <AddBlockBtn blocks={blocks}
                         index={data_items.length}
                         suggest={data_items.length === 0}
                         popup_direction={data_items.length ? 'up' : 'down'} />
          </div>

        </div>
      );
    }

    else {
      content__main = msg_div(`Unknown load state: ${load_state}`);
    }

    this.previous_load_state = load_state;

    return (
      <ContextProvider value={this.ctx}>
        <div className="post-builder" style={{ padding: '2rem', position: 'relative' }}>
          {content__main}

          {show_block_picker && <BlockPicker blocks={blocks}
                                             block_index={this.state.block_picker}
                                             scroll_offset={this.state.block_picker_offset}
                                             iframe_container_info={this.props.iframe_container_info || { }} />}
        </div>
      </ContextProvider>
    );
  }

}

