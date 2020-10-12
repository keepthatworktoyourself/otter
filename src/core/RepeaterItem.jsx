import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import RecursiveBlockRenderer from './RecursiveBlockRenderer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";


export default function RepeaterItem(props) {
  const index          = props.index;
  const dnd_context_id = props.dnd_context_id;
  const Draggable      = props.draggable_component || DnD.Draggable;
  const cb__delete     = props.cb__delete;
  const draggable_key  = `repeater-item-${index}`;

  return (
    <Draggable key={draggable_key} draggableId={draggable_key} index={index} type={dnd_context_id}>{(prov, snap) => (
      <div className="repeater-item-wrapper" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
        <div style={{ paddingBottom: '0.5rem' }}>

          {props.children}

          {cb__delete && (
            <div className="repeater-item-delete-btn" style={{ position: "absolute", top: 0, right: 0 }}>
              <a className="button is-small is-outlined" onClick={ev => cb__delete(index)}>
                <span className="icon is-small has-text-grey">
                  <FontAwesomeIcon icon={faTimes} />
                </span>

                <span>Delete</span>
              </a>
            </div>
          )}

        </div>
      </div>
    )}</Draggable>
  );
}

