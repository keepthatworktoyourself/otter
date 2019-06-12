import React from 'react';
import * as DnD from 'react-beautiful-dnd';

import Block from './Block';
import Components from '../component-mapping';
import Context__PageData from './Context__PageData';
import { str_hash } from '../utils';


// BlockList wrapper component
// -----------------------------
// - takes care of retrieving initial data and passing it on
//   to list items
// - passes on the getValues event handler (could be also done
//   one step up in PostBuilder?)

export default class BlockList extends React.Component {

  constructor(props) {
    super(props);
  }


// <button onClick={ctx_block.toggleMenu} className="pa3 button button--add has-background-light is-large block-button">
//   <span className="pa3 mt3 c-spot-icon db color-bg-grey-4">
//     <span className="c-icon c-spot-icon__icon f9">
//       <i className="fa fa-plus-circle"></i>
//     </span>
//   </span>
// </button>
// <div className="relative">
//   <div id="block-menu" className="dn absolute--center-x top-0 z-1 w5 mx-auto color-bg-grey-1 shadow-2 br2">
//     <ul>
//       {Object.keys(Components).map((obj, key) => {
//         return <li onClick={e => ctx_block.addBlock(e, obj)}
//                   className="block-list-item py3" type={obj}
//                   key={Math.abs(str_hash(obj))}>{obj}</li>
//       })}
//     </ul>
//   </div>
// </div>

// <BlockItem key={obj[0]} action={this.getValues} id={obj[0]} ctx_block={obj[1]} type={obj[1].__type_name} index={index}/>


  render() {
    return (
      <Context__PageData.Consumer>{(ctx) => (

        ctx.page_data().map((block, index) => (
          <DnD.Draggable key={`muffins-${index}`} draggableId={`muffins-${index}`} index={index}>{(provided, snapshot) => (
            <div ref={provided.innerRef}
                 {...provided.draggableProps} {...provided.dragHandleProps}
                 style={provided.draggableProps.style}>

              <Block block={block} block_index={index} />
            </div>
          )}</DnD.Draggable>
        ))

      )}</Context__PageData.Consumer>
    );
  }

}

