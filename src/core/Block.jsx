import React from 'react'
import * as DnD from 'react-beautiful-dnd'
import RecursiveBlockRenderer from './RecursiveBlockRenderer'
import PageDataContext from './PageDataContext'
import AddBlockBtn from './other/AddBlockBtn'
import BlockDeleteBtn from './other/BlockDeleteBtn'
import Utils from './definitions/utils'
import styles from './definitions/styles'


export default class Block extends React.Component {

  constructor(props) {
    super(props)
    this.drag_styles = { }
  }


  get_drag_styles(provided, snapshot) {
    const custom_styles = snapshot.isDragging ? this.drag_styles : { }
    return {
      ...custom_styles,
      ...provided.draggableProps.style,
    }
  }


  render() {
    const data_item         = this.props.data_item
    const index             = this.props.index
    const cb__delete        = this.props.cb__delete
    const block_numbers     = this.props.block_numbers
    const Draggable         = this.props.draggable_component          || DnD.Draggable
    const ContextConsumer   = this.props.consumer_component           || PageDataContext.Consumer
    const RecursiveRenderer = this.props.recursive_renderer_component || RecursiveBlockRenderer
    const draggable_key     = `block-${data_item.__uid}`
    let block

    return (
      <Draggable key={draggable_key} draggableId={draggable_key} index={index} type="block">{(prov, snap) => (
        <div className="outline-none" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={this.get_drag_styles(prov, snap)}>

          <ContextConsumer>{ctx => (this.ctx = ctx) && (
            <div className="c-block group relative pb-4" data-blocktype={data_item.__type}>

              <div className={`p-4 ${styles.control_bg}`}>
                <div className="relative">

                  <BlockDeleteBtn cb__delete={(ev) => cb__delete(index)} classes="top-0 right-0" />

                  {(block = Utils.find_block(ctx.blocks, data_item.__type)) && (
                    <>
                      <h3 className={`block-title ${styles.block_title} mb-4`}>
                        {block_numbers && <span className="mr-2 text-gray-300">{index + 1}</span>}
                        {block.description || Utils.humanify_str(block.type)}
                      </h3>
                      <div>
                        <RecursiveRenderer data_item={data_item} blocks={this.ctx.blocks} is_top_level={true} />
                      </div>
                    </>
                  )}

                  {!block && (
                    <h3 className={`block-title ${styles.block_title}`}>
                      {`Unknown block type: '${data_item.__type}'`}
                    </h3>
                  )}

                </div>
              </div>

              <div className="c-block-add-btn absolute hidden group-hover:block z-10" style={{
                top: index === 0 ? '-1rem' : '-1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
                <AddBlockBtn blocks={ctx.blocks} index={index} />
              </div>

            </div>
          )}</ContextConsumer>

        </div>
      )}</Draggable>
    )
  }

}

