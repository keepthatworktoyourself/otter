import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';
import Utils from '../definitions/utils';


export default class AddBlockBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.cb_toggle = this.cb_toggle.bind(this);
    this.cb_select = this.cb_select.bind(this);
  }


  cb_toggle() {
    if (this.is_simple) {
      this.setState({ open: !this.state.open });
    }
    else {
      this.ctx.open_block_picker(this.props.block_index);
    }
  }


  cb_select(ev) {
    this.setState({ open: false });

    const block_type = ev.currentTarget.getAttribute('data-block-type');
    this.ctx.add_block(block_type, this.props.index);
  }


  render() {
    const blocks      = this.props.blocks || [ ];
    const active      = this.state.open ? 'is-active' : '';
    const popup_dir   = this.props.popup_direction === 'up' ? 'is-up' : '';
    const is_simple   = !Utils.blocks_are_grouped(blocks);
    const c__dropdown = is_simple ? `dropdown ${popup_dir} ${active}` : '';
    this.is_simple    = is_simple;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className={c__dropdown}>

          <div className="dropdown-trigger">
            <button className="button is-rounded" aria-haspopup="true" aria-controls="dropdown-menu"
                    onClick={this.cb_toggle}>

              {this.props.suggest && (
                <span>
                  Add a block to get started
                </span>
              )}
              <span className="icon is-small has-text-grey">
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
            </button>
          </div>

          {is_simple && (
            <div className="dropdown-menu" style={{ left: '50%', transform: 'translateX(-50%)' }} id="dropdown-menu" role="menu">
              <div className="dropdown-content" style={{ maxHeight: '12rem', overflowY: 'scroll' }}>
                {blocks.map((block, i) => (
                  <a className="dropdown-item" onClick={this.cb_select} key={i} data-block-type={block.type}>
                    {block.description}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

