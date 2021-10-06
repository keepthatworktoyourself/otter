import React from 'react'
import * as DnD from 'react-beautiful-dnd'
import RecursiveBlockRenderer from './RecursiveBlockRenderer'
import {usePageData} from './PageDataContext'
import AddBlockBtn from './other/AddBlockBtn'
import BlockDeleteBtn from './other/BlockDeleteBtn'
import Utils from './definitions/utils'
import styles from './definitions/styles'

const drag_styles = { }

function get_drag_styles(provided, snapshot) {
  const custom_styles = snapshot.isDragging ? drag_styles : { }
  return {
    ...custom_styles,
    ...provided.draggableProps.style,
  }
}

export default function Block({data_item, index, block_numbers, ...props}) {
  const ctx               = usePageData()
  const blocks            = ctx.blocks
  const Draggable         = props.draggable_component          || DnD.Draggable
  const RecursiveRenderer = props.recursive_renderer_component || RecursiveBlockRenderer
  const draggable_key     = `block-${data_item.__uid}`
  const block = Utils.find_block(blocks, data_item.__type)

  return (
    <Draggable key={draggable_key} draggableId={draggable_key} index={index} type="block"
      isDragDisabled={!ctx.can_add_blocks}>{(prov, snap) => (
      <div className="outline-none"
           ref={prov.innerRef}
           {...prov.draggableProps} {...prov.dragHandleProps}
           style={get_drag_styles(prov, snap)}
      >
        <div className="c-block group relative pb-4" data-blocktype={data_item.__type}>

          <div className={`p-4 ${styles.control_bg}`}>
            <div className="relative">

              {ctx.can_add_blocks && (
                <BlockDeleteBtn classes="top-0 right-0" delete_block={() => ctx.delete_item(index)} />
              )}

              {block && (
                <>
                  <h3 className={`block-title ${styles.block_title} mb-4`}>
                    {block_numbers && <span className="mr-2 text-gray-300">{index + 1}</span>}
                    {block.description || Utils.humanify_str(block.type)}
                  </h3>
                  <div>
                    <RecursiveRenderer data_item={data_item} blocks={blocks} is_top_level={true} />
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

          {ctx.can_add_blocks && (
            <div className="c-block-add-btn absolute hidden group-hover:block z-1" style={{
              top: index === 0 ? '-1rem' : '-1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <AddBlockBtn index={index} />
            </div>
          )}

        </div>
      </div>
    )}</Draggable>
  )
}

