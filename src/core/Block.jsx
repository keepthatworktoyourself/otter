import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import RecursiveBlockRenderer from './RecursiveBlockRenderer';
import PageDataContext from './PageDataContext';
import AddBlockBtn from './other/AddBlockBtn';
import Utils from './definitions/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Block extends React.Component {

  constructor(props) {
    super(props);
    this.cb_delete = this.cb_delete.bind(this);
    this.drag_styles = {
      border:          '3px solid rgba(0,0,255, 0.12)',
      backgroundColor: 'rgba(0,0,255, 0.06)',
    };
  }


  get_drag_styles(provided, snapshot) {
    const custom_styles = snapshot.isDragging ? this.drag_styles : { };
    return {
      ...custom_styles,
      ...provided.draggableProps.style,
    };
  }


  cb_delete(ev) {
    this.ctx.remove_block(this.props.data_item.__uid);
  }


  render() {
    const data_item       = this.props.data_item;
    const index           = this.props.index;
    const Draggable       = this.props.draggable_component      || DnD.Draggable;
    const ContextConsumer = this.props.consumer_component       || PageDataContext.Consumer;
    const FieldRenderer   = this.props.field_renderer_component || RecursiveBlockRenderer;
    let block;

    return (
      <Draggable key={`block-${data_item.__uid}`} draggableId={`block-${data_item.__uid}`} index={index} type="block">{(prov, snap) => (
        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={this.get_drag_styles(prov, snap)}>

          <ContextConsumer>{ctx => (this.ctx = ctx) && (
            <div className="c-block" style={{ position: 'relative', paddingBottom: '1rem' }} data-blocktype={data_item.__type}>

              <div className="bg-solid" style={{ padding: '1rem' }}>
                <div style={{ position: 'relative' }}>

                  <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <a className="block-delete-btn button is-rounded is-small is-outlined" onClick={this.cb_delete}>
                      <span style={{ marginRight: '0.5rem' }}>Delete block</span>
                      <FontAwesomeIcon icon={faTimes} />
                    </a>
                  </div>

                  {(block = Utils.find_block(ctx.blocks, data_item.__type)) && (
                    <>
                      <h3 className="title is-4">{block.description || block.type}</h3>
                      <div>
                        <FieldRenderer data_item={data_item} block={block} is_top_level={true} />
                      </div>
                    </>
                  )}

                  {!block && (
                    <h3 className="title is-4">{`Unknown block type: '${data_item.__type}'`}</h3>
                  )}

                </div>
              </div>

              <div className="c-block-add-btn" style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                <AddBlockBtn blocks={ctx.blocks} block_index={index} />
              </div>

            </div>
          )}</ContextConsumer>

        </div>
      )}</Draggable>
    );
  }

}

