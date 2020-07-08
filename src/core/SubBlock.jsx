import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import PageDataContext from './PageDataContext';
import toggler from './toggler';
import Utils from './Utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faTimes} from '@fortawesome/free-solid-svg-icons';
import Toggle from 'react-toggle';

export default class SubBlock extends React.Component {

  constructor(props) {
    super(props);
    this.cb__optional_block_toggle = this.cb__optional_block_toggle.bind(this);
  }

  cb__optional_block_toggle(ev) {
    this.props.field.enabled = ev.target.checked;
    this.ctx.should_update();
    ev.target.blur();
  }

  render() {
    const block = this.props.block;
    const field = this.props.field;  // Optional: the field wrapping 'block' (for title)
    const toggle_id = `toggle-${Utils.rnd_str(8)}`;

    const contents_hidden = !!this.props.contents_hidden;

    const is_optional = field.def.optional;
    const is_optional__enabled = is_optional && field.enabled;
    const contents_enabled = !is_optional || is_optional__enabled;

    const title = field && (field.def.description || field.def.name);

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="inner-block">

          {title && (
            <div>
              <h4 style={{ cursor: 'pointer', paddingBottom: '0.5rem' }} className="title is-7 is-marginless"
                  onClick={ev => toggler(ev, ctx)} data-toggler-target={toggle_id}>
                {title}

                {is_optional && (
                  <span style={{ paddingLeft: '0.3rem', position: 'relative', top: '1px' }}>
                    <Toggle icons={false} onChange={this.cb__optional_block_toggle} />
                  </span>
                )}

                {contents_enabled && (
                  <span className="icon c-toggler-icon" style={{ marginLeft: '0.25rem'}}>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </span>
                )}
              </h4>
            </div>
          )}

          {contents_enabled && (
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
          )}

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

