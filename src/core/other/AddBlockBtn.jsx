import React from 'react'
import Icons from './Icons'
import PageDataContext from '../PageDataContext'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'


export default class AddBlockBtn extends React.Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
    this.cb__toggle = this.cb__toggle.bind(this)
    this.cb__select = this.cb__select.bind(this)
  }


  cb__toggle() {
    if (this.is_flat) {
      this.setState({ open: !this.state.open })
    }
    else {
      this.ctx.open_block_picker(this.props.index)
    }
  }


  cb__select(ev) {
    this.setState({ open: false })
    const block_type = ev.currentTarget.getAttribute('data-block-type')
    this.ctx.add_item(block_type, this.props.index)
  }


  render() {
    const blocks           = this.props.blocks || [ ]
    const active           = this.state.open ? 'is-active' : ''
    const popup_dir        = this.props.popup_direction || 'down'
    const suggest          = this.props.suggest
    const ContextConsumer  = this.props.consumer_component || PageDataContext.Consumer
    this.is_flat           = Utils.blocks_are_simple(blocks)
    const displayed_blocks = this.is_flat && blocks.filter(b => b && b.hidden !== true)

    const btn_txt = (
      <span>
        {suggest ? (
          <span className="mr-1">
            Insert block
          </span>
        ) : ''}
        <span class={`c-svg ${suggest ? 'c-svg--toggler' : ''}`}>
          <Icons.Icon icon="PlusIcon" />
        </span>
      </span>
    )

    const btn = (
      <button className={`${styles.button} ${styles.button_pad} ${styles.control_bg} ${styles.control_border} ${styles.control_border__interactive}`}
              onClick={this.cb__toggle}
      >
        {btn_txt}
      </button>
    )

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div>

          {this.is_flat && (
            <div className="add-block-btn relative">
              {btn}

              {this.state.open && (
                <div className={`
                       add-block-btn-menu
                       absolute
                       rounded-lg overflow-hidden
                       left-1/2
                       ${styles.control_border}
                       ${popup_dir === 'down' ? 'top-9' : ''}
                       ${popup_dir === 'up' ? 'bottom-9' : ''}
                     `}
                     style={{minWidth: '10rem', transform: 'translateX(-50%)'}}
                >
                  {displayed_blocks.map((block, i) => (
                    <a className={`
                         add-block-btn-menu-item
                         block p-2
                         cursor-pointer
                         ${styles.control_bg} hover:bg-gray-100 active:bg-gray-200
                         ${i < displayed_blocks.length - 1 ? 'border-b' : ''}
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

          {!this.is_flat && btn}

        </div>
      )}</ContextConsumer>
    )
  }

}

