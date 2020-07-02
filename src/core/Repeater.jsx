import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import SubBlock from './SubBlock';
import PageDataContext from './PageDataContext';
import toggler from './toggler';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {rnd_str} from './utils';


export default class Repeater extends React.Component {

  cb_toggle_additem_dialogue() {
    this.setState({ show_dialogue: !(this.state && this.state.show_dialogue) });
  }


  cb_add(ctx, ev, type) {
    ev.stopPropagation();
    ev.preventDefault();

    this.setState({ show_dialogue: false });
    ctx.add_repeater_item(this.props.field.uid, type);
  }


  cb_delete(ctx, ev, subblock) {
    ev.stopPropagation();
    ev.preventDefault();

    ctx.remove_repeater_item(this.props.field.uid, subblock.uid);
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;
    const show_add_item_dialogue = this.state && this.state.show_dialogue;
    const toggle_id = `repeater-${rnd_str(8)}`;

    const repeater_title = field.def.description || field.def.name;
    const arr = field.value;

    return (
      <PageDataContext.Consumer>{ctx => (
        <div className="repeater" data-id={block.uid}>

          <div style={{ paddingBottom: '0.5rem' }}>
            {repeater_title && (
              <h4 style={{ cursor: 'pointer' }} className="title is-6 is-marginless" onClick={ev => toggler(ev, ctx)} data-toggler-target={toggle_id}>
                {repeater_title}
                <span className="icon c-toggler-icon"><FontAwesomeIcon icon={faChevronDown} /></span>
              </h4>
            )}
          </div>

          <div className="toggle" id={toggle_id} style={{ display: 'none' }}>
            <div style={{ padding: '1rem', border: '2px dotted rgba(0,0,0, 0.15)', borderRadius: '1.3rem' }}>

              {/* Repeater items */}
              <DnD.Droppable droppableId={field.uid} type={field.uid}>{(prov, snap) => (
                <div ref={prov.innerRef} {...prov.droppableProps}>

                  {(arr || [ ]).map((subblock, i) => (
                    <DnD.Draggable key={subblock.uid} draggableId={subblock.uid} index={i} type={field.uid}>{(prov, snap) => (
                      <div className="repeater-item-wrapper" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>

                        <div style={{ paddingBottom: '0.5rem' }}>
                          <SubBlock block={subblock} contents_hidden={false} cb_delete={ev => this.cb_delete.call(this, ctx, ev, subblock)} />
                        </div>

                      </div>
                    )}</DnD.Draggable>
                  ))}

                  {prov.placeholder}

                </div>
              )}</DnD.Droppable>
              {/* End repeater items */}

              {/* 'Add' button */}
              <div>
                <div className={`dropdown ${show_add_item_dialogue ? 'is-active' : ''}`}>

                  <div className="dropdown-trigger">
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={this.cb_toggle_additem_dialogue.bind(this)}>
                      <span className="icon is-small has-text-grey">
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </span>
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      {(field.def.subblock_types || [ ]).map((t, i) => (
                        <a className="dropdown-item" onClick={ev => this.cb_add.call(this, ctx, ev, t)} key={i}>
                          {t.description}
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              {/* End 'add' button */}

            </div>
          </div>{/* End toggle */}

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

