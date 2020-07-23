import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';


export default class AddBlockBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }


  cb_toggle() {
    this.setState({ open: !this.state.open });
  }


  cb_select(ev, type) {
    this.setState({ open: false });
    this.props.cb_select(ev, type);
  }


  render() {
    const active = this.state.open ? 'is-active' : '';
    const popup_dir = this.props.popup_direction === 'up' ? 'is-up' : '';
    const blocks = this.props.blocks || [ ];

    return (
      <div className={`dropdown ${popup_dir} ${active}`}>

        <div className="dropdown-trigger">
          <button className="button is-rounded" aria-haspopup="true" aria-controls="dropdown-menu"
                  onClick={this.cb_toggle.bind(this)}>

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

        <div className="dropdown-menu" style={{ left: '50%', transform: 'translateX(-50%)' }} id="dropdown-menu" role="menu">
          <div className="dropdown-content" style={{ maxHeight: '12rem', overflowY: 'scroll' }}>
            {blocks.map((block_def, i) => (
              <a className="dropdown-item" onClick={ev => this.cb_select(ev, block_def.type)} key={i}>
                {block_def.description}
              </a>
            ))}
          </div>
        </div>

      </div>
    );
  }

}

