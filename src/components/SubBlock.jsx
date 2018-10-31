import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import toggler from './toggler';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faTimes} from '@fortawesome/free-solid-svg-icons';
import {rnd_str} from '../utils';

export default class SubBlock extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;  // Optional: the field wrapping 'block' (for title)
    const contents_hidden = !!this.props.contents_hidden;
    const toggle_id = `toggle-${rnd_str(8)}`;

    const title = field && (field.def.description || field.def.name);

    return (
      <div className="inner-block">

        {title && (
          <div>
            <h4 style={{ cursor: 'pointer', paddingBottom: '0.5rem' }} className="title is-6 is-marginless" onClick={toggler} data-toggler-target={toggle_id}>
              {title}
              <span className="icon c-toggler-icon"><FontAwesomeIcon icon={faChevronDown} /></span>
            </h4>
          </div>
        )}

        <div className="toggle" id={toggle_id} style={{ display: contents_hidden ? 'none' : 'block', paddingBottom: '0.5rem' }}>
          <div className="bg" style={{ padding: '1rem', borderRadius: '1rem' }}>
            <div style={{ position: 'relative', paddingTop: this.props.cb_delete ? '0.75rem' : 0 }}>

              {this.props.cb_delete && (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                  <a className="button is-rounded is-small is-outlined" onClick={this.props.cb_delete}>
                    <span style={{ paddingRight: '0.5rem' }}>Delete</span>
                    <FontAwesomeIcon icon={faTimes} />
                  </a>
                </div>
              )}

              <RecursiveFieldRenderer block={block} />

            </div>
          </div>
        </div>

      </div>
    );
  }

}

