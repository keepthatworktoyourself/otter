import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';
import Utils from '../definitions/utils';


export default class AddBlockBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.cb__toggle = this.cb__toggle.bind(this);
    this.cb__select = this.cb__select.bind(this);
  }


  cb__toggle() {
    if (this.is_simple) {
      this.setState({ open: !this.state.open });
    }
    else {
      this.ctx.open_block_picker(this.props.index);
    }
  }


  cb__select(ev) {
    this.setState({ open: false });

    const block_type = ev.currentTarget.getAttribute('data-block-type');
    this.ctx.add_item(block_type, this.props.index);
  }


  render() {
    const blocks           = this.props.blocks || [ ];
    const active           = this.state.open ? 'is-active' : '';
    const popup_dir        = this.props.popup_direction === 'up' ? 'is-up' : '';
    const suggest          = this.props.suggest;
    const ContextConsumer  = this.props.consumer_component || PageDataContext.Consumer;
    this.is_simple         = Utils.blocks_are_simple(blocks);
    const c__dropdown      = `dropdown ${this.is_simple ? `${popup_dir} ${active}` : ''}`;
    const displayed_blocks = this.is_simple && blocks.filter(b => b && b.hidden !== true);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={c__dropdown}>

          <div className="dropdown-trigger">
            <button className="button is-rounded" aria-haspopup="true" aria-controls="dropdown-menu"
                    onClick={this.cb__toggle}>

              {suggest && (
                <span>Add a block to get started</span>
              )}

              <span className="icon is-small has-text-grey">
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
            </button>
          </div>

          {this.is_simple && (
            <div className="dropdown-menu" style={{ left: '50%', transform: 'translateX(-50%)' }} id="dropdown-menu" role="menu">
              <div className="dropdown-content" style={{ maxHeight: '12rem', overflowY: 'scroll' }}>
                {displayed_blocks.map((block, i) => (
                  <a className="dropdown-item" onClick={this.cb__select} key={i} data-block-type={block.type}>
                    {block.description || Utils.humanify_str(block.type)}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}</ContextConsumer>
    );
  }

}

