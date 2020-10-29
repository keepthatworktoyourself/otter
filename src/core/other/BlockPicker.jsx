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
    this.ctx.add_item(ev.currentTarget.getAttribute('data-block-type'), this.props.block_index);
  }


  render() {
    const blocks = this.props.blocks || { };
    const block_group_keys = Object.keys(blocks);
    const container  = this.props.iframe_container_info || {
      y:      0,
      height: 0,
    };
    const offset = (this.props.scroll_offset || 0) + container.y;
    const outer_max_height = container.height;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="is-overlay" style={{ zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem' }}>
          <div className="wrapper" style={{
            transform: `translateY(${offset}px`,
            transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            maxHeight: 'calc(100vh - 2rem)',
            overflowY: 'auto' }}>
            <div style={{ maxHeight: outer_max_height || 'none' }}>

            <div className="box" style={{ position: 'relative', paddingTop: '2rem', borderRadius: 0 }}>

              <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', }}>
                <span style={{ cursor: 'pointer' }} onClick={this.close}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>

              {block_group_keys.map((k, i) => (
                <div className={ i < block_group_keys.length - 1 ? 'mb-6' : 'mb-4' } key={i}>
                  <h3 className="title is-7 pl-1 pb-2" style={{ borderBottom: '1px solid #eee' }}>
                    {blocks[k].name || k}
                  </h3>

                  <div className="columns is-mobile is-multiline">
                    {blocks[k].blocks.map((block, j) => (
                      <div className="column is-4-mobile is-3-tablet is-3-desktop is-2-widescreen" key={j}>

                        <div className="card">
                          <div className="card-content" style={{ padding: '1rem' }}>
                            <h3 className="title is-6">
                              {block.description || block.__type}
                            </h3>
                          </div>

                          <figure className="image is-5by3 has-background-light">
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
        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

