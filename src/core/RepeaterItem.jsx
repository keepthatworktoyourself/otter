import React from 'react'
import * as DnD from 'react-beautiful-dnd'
import BlockDeleteBtn from './other/BlockDeleteBtn'
import styles from './definitions/styles'

export default function RepeaterItem(props) {
  const index          = props.index
  const dnd_key        = `draggable-${props.dnd_key || index}`
  const dnd_context_id = props.dnd_context_id
  const Draggable      = props.draggable_component || DnD.Draggable
  const cb__delete     = props.cb__delete

  return (
    <Draggable key={dnd_key} draggableId={dnd_key} type={dnd_context_id} index={index}>{(prov, snap) => (
      <div className="repeater-item-wrapper" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
        <div className="pb-2">
          <div className={`relative pt-8 ${styles.nested_block} ${styles.control_bg}`}>
            {props.children}
            {cb__delete && <BlockDeleteBtn cb__delete={ev => cb__delete(index)} classes="top-2 right-2" />}
          </div>
        </div>
      </div>
    )}</Draggable>
  )
}

