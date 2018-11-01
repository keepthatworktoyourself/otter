import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import Context__PageData from './Context__PageData';
import AddBlockBtn from './AddBlockBtn';
import component_definitions from '../component-mapping';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Block extends React.Component {

  constructor(props) {
    super(props);
  }


  cb_delete(ctx, ev) {
    ctx.remove_block(this.props.block.uid);
  }


  cb_add(ctx, ev, block_type) {
    ev.stopPropagation();
    ev.preventDefault();

    ctx.add_block(block_type, this.props.block_index);
  }


  render() {
    const block = this.props.block;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="c-block" style={{ position: 'relative', paddingBottom: '1rem' }}>

          <div className="bg-solid" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative' }}>

              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <a className="button is-rounded is-small is-outlined" onClick={ev => this.cb_delete.call(this, ctx, ev)}>
                  <span style={{ marginRight: '0.5rem' }}>Delete block</span>
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>

              <h3 className="title is-4">{block.def.description}</h3>
              <div>
                <RecursiveFieldRenderer block={block} />
              </div>

            </div>
          </div>

          <div className="c-block-add-btn" style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
            <AddBlockBtn cb_select={(ev, block_type) => this.cb_add.call(this, ctx, ev, block_type)} items={this.props.supported_blocks} />
          </div>

        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

