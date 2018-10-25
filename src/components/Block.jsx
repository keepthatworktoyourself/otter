import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';


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

    this.state = {
      context_obj: null,
    };
  }


  render() {
    const block = this.props.block;

    return (
      <div class="block__outer" style={{ paddingBottom: '1rem' }}>
        <h3>{block.type}</h3>
        <div class="block__inner">
          <RecursiveFieldRenderer block={block} />
        </div>
      </div>
    );
  }

}

