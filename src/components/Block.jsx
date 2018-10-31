import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import Context__PageData from './Context__PageData';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Block extends React.Component {

  constructor(props) {
    super(props);
  }


  cb_delete(ctx, ev) {
    ctx.remove_block(this.props.block.uid);
  }


  render() {
    const block = this.props.block;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div style={{ paddingBottom: '1rem' }}>
          <div className="bg-solid" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative' }}>

              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <a className="button is-rounded is-small is-outlined" onClick={ev => this.cb_delete.call(this, ctx, ev)}>
                  <span style={{ marginRight: '0.5rem' }}>Delete block</span>
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>

              <h3 className="title is-4">{block.def.description}</h3>
              <div className="">
                <RecursiveFieldRenderer block={block} />
              </div>

            </div>
          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

