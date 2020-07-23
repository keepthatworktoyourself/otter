import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import PageDataContext from './PageDataContext';
import AddBlockBtn from './other/AddBlockBtn';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class Block extends React.Component {

  constructor(props) {
    super(props);
    this.cb_delete = this.cb_delete.bind(this);
  }


  cb_delete(ev) {
    this.ctx.remove_block(this.props.block.uid);
  }


  render() {
    const block = this.props.block;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="c-block" style={{ position: 'relative', paddingBottom: '1rem' }} data-blocktype={block.type}>

          <div className="bg-solid" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative' }}>

              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <a className="button is-rounded is-small is-outlined" onClick={this.cb_delete}>
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
            <AddBlockBtn cb_select={(ev, type) => ctx.add_block(type, this.props.block_index)}
                         blocks={ctx.blockset} />
          </div>

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

