import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import toggler from './toggler';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faTimes} from '@fortawesome/free-solid-svg-icons';
import {rnd_str} from '../utils';

export default class InnerBlock extends React.Component {

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
          <div style={{ paddingBottom: '0.5rem' }}>
            <h4 style={{ cursor: 'pointer' }} className="title is-6 is-marginless" onClick={toggler} data-toggler-target={toggle_id}>
              {title}
              <span className="icon c-toggler-icon"><FontAwesomeIcon icon={faChevronDown} /></span>
            </h4>
          </div>
        )}

        <div className="toggle" id={toggle_id} style={{ display: contents_hidden ? 'none' : 'block' }}>
          <div className="bg" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative', paddingTop: this.props.cb_delete ? '0.75rem' : 0 }}>

              {this.props.cb_delete && (
                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                  <a className="button is-rounded is-small is-danger is-outlined" onClick={this.props.cb_delete}>
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

