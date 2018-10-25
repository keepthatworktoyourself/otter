import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import InnerBlock from './InnerBlock';
import Context__PageData from './Context__PageData';
import toggler from './toggler';


const subblock_styles = {
  padding: '1rem',
  marginLeft: '1rem',
  marginBottom: '1rem',
  border: '1px solid rgba(0,0,0, 0.075)',
  backgroundColor: 'rgba(0,0,0, 0.025)',
  position: 'relative',
};


export default class Block extends React.Component {

  constructor(props) {
    super(props);
  }


  cb_toggle_additem_dialogue() {
    this.setState({ show_dialogue: !(this.state && this.state.show_dialogue) });
  }


  cb_add_item(ctx, ev, type) {
    ev.stopPropagation();
    ev.preventDefault();

    this.setState({ show_dialogue: false });
    ctx.add_repeater_item(this.props.field.uid, type);
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;
    const show_add_item_dialogue = this.state && this.state.show_dialogue;

    const repeater_title = field.def.description || field.def.name;
    const arr = field.value;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div class="repeater" style={subblock_styles}>

          <h3 style={{ marginBottom: '0.6rem', cursor: 'pointer' }} onClick={toggler}>
            {repeater_title}
          </h3>

          <div class="repeater__inner toggle">
            <DnD.Droppable droppableId={field.uid} type={field.uid}>{(prov, snap) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>

                {(arr || [ ]).map((subblock, i) => (
                  <DnD.Draggable key={subblock.uid} draggableId={subblock.uid} index={i} type={field.uid}>{(prov, snap) => (
                    <div class="wrapper-repeater-item" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>

                      <InnerBlock block={subblock} contents_hidden={false} />

                    </div>
                  )}</DnD.Draggable>
                ))}

                {prov.placeholder}

              </div>
            )}</DnD.Droppable>
          </div>

          <div style={{ width: '3rem', height: '3rem', backgroundColor: 'lightblue', cursor: 'pointer' }} onClick={this.cb_toggle_additem_dialogue.bind(this)}>
            {show_add_item_dialogue && (
              <ul>
                {(field.def.subblock_types || [ ]).map(t => (
                  <li onClick={ev => this.cb_add_item.call(this, ctx, ev, t)} style={{ backgroundColor: 'green' }}>{t.type}</li>
                ))}
              </ul>
            )}
          </div>

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

