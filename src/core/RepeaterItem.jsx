import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RecursiveBlockRenderer from './RecursiveBlockRenderer';
import styles from './definitions/styles';


export default function RepeaterItem(props) {
  const index          = props.index;
  const dnd_key        = `draggable-${props.dnd_key || index}`;
  const dnd_context_id = props.dnd_context_id;
  const Draggable      = props.draggable_component || DnD.Draggable;
  const cb__delete     = props.cb__delete;

  return (
    <Draggable key={dnd_key} draggableId={dnd_key} type={dnd_context_id} index={index}>{(prov, snap) => (
      <div className="repeater-item-wrapper" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
        <div className="pb-2">
          <div className={`relative pt-8 ${styles.nested_block(2)}`}>
            {props.children}

            {cb__delete && (
              <a className={`absolute block ${styles.button} ${styles.button_pad_sm} ${styles.button_dark_border}`}
                 style={{ top: '0.5rem', right: '0.5rem' }}
                 onClick={ev => cb__delete(index)}
              >
                <span className="">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    )}</Draggable>
  );
}

