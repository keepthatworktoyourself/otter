import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import SubBlock from './SubBlock';
import PageDataContext from './PageDataContext';
import Utils from './definitions/utils';
import DDToggle from './other/DDToggle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';


export default class Repeater extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contents_hidden: true,
      show_dialogue: false,
    };

    this.cb_add_btn  = this.cb_add_btn.bind(this);
    this.cb_add      = this.cb_add.bind(this);
    this.cb_delete   = this.cb_delete.bind(this);
    this.cb_showhide = this.cb_showhide.bind(this);
  }


  cb_add_btn(ev) {
    const subblock_types = this.props.field.def.subblock_types;

    if (subblock_types.length > 1) {
      this.setState({
        show_dialogue: !this.state.show_dialogue,
      });
    }
    else {
      this.cb_add(null);
    }
  }


  cb_add(ev) {
    this.setState({
      show_dialogue: false,
    });

    const type = ev ? parseInt(ev.target.getAttribute('data-subblock-type')) : 0;
    const def = this.props.field.def.subblock_types[type];

    this.ctx.add_repeater_item(this.props.field.uid, def);
  }


  cb_delete(subblock) {
    this.ctx.remove_repeater_item(this.props.field.uid, subblock.uid);
  }


  cb_showhide(ev) {
    this.setState({
      contents_hidden: !this.state.contents_hidden,
    });
    this.ctx.block_toggled();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;
    const max = field.def.max || -1;

    const repeater_title = field.def.description || field.def.name;
    const subblocks      = field.value || [ ];
    const subblock_defs  = field.def.subblock_types || [ ];
    const multiple_types = subblock_defs.length !== 1;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="repeater" data-id={block.uid}>

          <div style={{ paddingBottom: '0.5rem' }}>
            {repeater_title && (
              <h4 style={{ cursor: 'pointer' }} className="title is-7 is-marginless">
                <span onClick={this.cb_showhide} style={{ display: 'inline-block' }}>
                  {repeater_title}

                  <DDToggle is_open={!this.state.contents_hidden} cb={this.cb_showhide} />
                </span>
              </h4>
            )}
          </div>

          {!this.state.contents_hidden && (
            <div style={{ paddingBottom: '0.5rem' }}>
              <div className="otter-box" style={{ padding: '1rem' }}>

                {/* Repeater items */}
                <DnD.Droppable droppableId={field.uid} type={field.uid}>{(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.droppableProps}>

                    {subblocks.map((subblock, i) => (
                      <DnD.Draggable key={subblock.uid} draggableId={subblock.uid} index={i} type={field.uid}>{(prov, snap) => (
                        <div className="repeater-item-wrapper" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>

                          <div style={{ paddingBottom: '0.5rem' }}>
                            <SubBlock block={subblock}
                                      contents_hidden={false}
                                      border={true}
                                      cb_delete={ev => this.cb_delete(subblock)} />
                          </div>

                        </div>
                      )}</DnD.Draggable>
                    ))}

                    {prov.placeholder}

                  </div>
                )}</DnD.Droppable>
                {/* End repeater items */}


                {/* 'Add' button */}
                {(max === -1 || subblocks.length < max) && (
                  <div>
                    <div className={`dropdown ${this.state.show_dialogue ? 'is-active' : ''}`}>

                      <div className="dropdown-trigger">
                        <button className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu"
                                onClick={this.cb_add_btn}>
                          <span className="icon is-small has-text-grey">
                            <FontAwesomeIcon icon={faPlusCircle} />
                          </span>
                          <span>Add</span>
                        </button>
                      </div>

                      {multiple_types && (
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                          <div className="dropdown-content">
                            {subblock_defs.map((t, i) => (
                              <a className="dropdown-item" onClick={this.cb_add} key={i} data-subblock-type={i}>
                                {t.description}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
                {/* End 'add' button */}

              </div>
            </div>
          )}

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

