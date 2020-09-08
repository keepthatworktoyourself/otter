import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';


export default class BlockPicker extends React.Component {

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.cb_select = this.cb_select.bind(this);
  }


  close(ev) {
    this.ctx.close_block_picker();
  }


  cb_select(ev) {
    this.close();
    this.ctx.add_block(ev.currentTarget.getAttribute('data-block-type'), this.props.block_index);
  }


  render() {
    const blocks = (this.props.blocks && this.props.blocks[0]) || { };
    const block_keys = Object.keys(blocks);

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="is-overlay" style={{ zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem' }}>
          <div style={{ position: 'relative', maxHeight: '100%', overflowY: 'scroll' }}>
            <div className="box" style={{ paddingTop: '2rem', borderRadius: 0 }}>

              <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', }}>
                <span style={{ cursor: 'pointer' }} onClick={this.close}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>

              {block_keys.map((k, i) => (
                <div className={ i < block_keys.length - 1 ? 'mb-6' : 'mb-4' }>
                  <h3 className="title is-7 pl-1 pb-2" style={{ borderBottom: '1px solid #eee' }}>
                    {blocks[k].name || k}
                  </h3>

                  <div className="columns is-mobile is-multiline">
                    {blocks[k].blocks.map(block => (
                      <div className="column is-6-mobile is-4-tablet is-3-desktop">

                        <div className="card">
                          <div className="card-content" style={{ padding: '1rem' }}>
                            <h3 className="title is-6">
                              {block.description || block.__type}
                            </h3>
                          </div>

                          <figure className="image is-3by2 has-background-light">
                            {block.thumbnail && (
                              <img src={block.thumbnail} />
                            )}
                          </figure>

                          <footer className="card-footer is-6">
                            <a className="card-footer-item is-size-7" onClick={this.cb_select}
                               data-block-type={block.type}>
                              Insert
                            </a>
                          </footer>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

