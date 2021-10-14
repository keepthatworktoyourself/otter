import React from 'react'
import * as DnD from 'react-beautiful-dnd'
import BlockDeleteBtn from './other/BlockDeleteBtn'
import styles from './definitions/styles'

export default function RepeaterItem({index, cb__delete, dnd_key, dnd_context_id, ...props}) {
  const draggable_key   = `draggable-${props.dnd_key || index}`
  const Draggable = props.draggable_component || DnD.Draggable

  return (
    <Draggable key={draggable_key}
               draggableId={draggable_key}
               type={dnd_context_id}
               index={index}
    >
      {prov => (
        <div className="repeater-item-wrapper"
             ref={prov.innerRef}
             {...prov.draggableProps}
             {...prov.dragHandleProps}
        >
          <div className="pb-2">
            <div className={`relative pt-8 ${styles.nested_block} ${styles.control_bg}`}>
              {props.children}
              {cb__delete && <BlockDeleteBtn delete_block={() => cb__delete(index)} classes="top-2 right-2" />}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
