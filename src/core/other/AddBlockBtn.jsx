import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import PageDataContext from '../PageDataContext';
import Utils from '../definitions/utils';
import styles from '../definitions/styles';


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
    const popup_dir        = this.props.popup_direction || 'down';
    const suggest          = this.props.suggest;
    const ContextConsumer  = this.props.consumer_component || PageDataContext.Consumer;
    this.is_simple         = Utils.blocks_are_simple(blocks);
    const displayed_blocks = this.is_simple && blocks.filter(b => b && b.hidden !== true);

    const btn_txt = (
      <span>
        {suggest ? (
          <span className="mr-1">
            Insert block
          </span>
        ) : ''}
        <FontAwesomeIcon icon={faPlus} />
      </span>
    );

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div>

          {this.is_simple && (
            <div className="add-block-btn relative">
              <button className={`${styles.dropdown_button} ${styles.button_dark_border}`}
                      onClick={this.cb__toggle}
              >
                {btn_txt}
              </button>

              {this.state.open && (
                <div className={`
                       absolute
                       border ${styles.button_dark_border_static}
                       rounded
                       left-1/2
                       ${popup_dir === 'down' ? 'top-7' : ''}
                       ${popup_dir === 'up' ? 'bottom-7' : ''}
                     `}
                     style={{minWidth: '10rem', transform: 'translateX(-50%)'}}
                >

                  {displayed_blocks.map((block, i) => (
                    <a className={`
                         block p-2
                         ${styles.button_bg} ${styles.button_bg_hover} ${styles.button_bg_active}
                         ${i < displayed_blocks.length - 1 ? 'border-b' : ''} border-gray-500
                       `}
                       onClick={this.cb__select} key={i} data-block-type={block.type}
                    >
                      {block.description || Utils.humanify_str(block.type)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {!this.is_simple && (
            <button className={`${styles.dropdown_button} ${styles.button_dark_border}`}
                    onClick={this.cb__toggle}
            >
              {btn_txt}
            </button>
          )}

        </div>
      )}</ContextConsumer>
    );
  }

}

