import React from 'react';
import * as DnD from 'react-beautiful-dnd';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import toggler from './toggler';


const subblock_styles = {
  padding: '1rem',
  marginLeft: '1rem',
  marginBottom: '1rem',
  border: '1px solid rgba(0,0,0, 0.075)',
  backgroundColor: 'rgba(0,0,0, 0.025)',
  position: 'relative',
};


export default class InnerBlock extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;  // Optional: the field wrapping 'block' (for title)
    const contents_hidden = !!this.props.contents_hidden;

    const title = field && (field.def.description || field.def.name);

    return (
      <div class="wrapped-sub-block">
        <div style={subblock_styles}>

          {title && (
            <h3 style={{ marginBottom: '0.6rem' }} style={{ cursor: 'pointer' }} onClick={toggler}>{title}</h3>
          )}

          <div class="wrapped-sub-block__inner toggle" style={{ display: contents_hidden ? 'none' : 'block', marginTop: '1rem' }}>
            <RecursiveFieldRenderer block={block} />
          </div>

        </div>
      </div>
    );
  }

}

