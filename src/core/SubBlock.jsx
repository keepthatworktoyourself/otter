import React from 'react';
import RecursiveFieldRenderer from './RecursiveFieldRenderer';
import PageDataContext from './PageDataContext';
import Utils from './definitions/utils';
import DDToggle from './other/DDToggle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import Toggle from 'react-toggle';


export default class SubBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contents_hidden: true,
    };
    this.cb__optional_block_toggle = this.cb__optional_block_toggle.bind(this);
    this.cb__showhide = this.cb__showhide.bind(this);
  }


  cb__optional_block_toggle(ev) {
    ev.currentTarget.blur();
    this.props.field.enabled = ev.currentTarget.checked;

    if (!this.props.field.enabled) {
      this.setState({
        contents_hidden: true,
      });
    }

    this.ctx.value_updated();
    this.ctx.should_redraw();
  }


  cb__showhide(ev) {
    if (Utils.subblock_is_enabled(this.props.field)) {
      this.setState({
        contents_hidden: !this.state.contents_hidden,
      });
      this.ctx.should_redraw();
    }
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    const contents_hidden = this.state.contents_hidden && this.props.contents_hidden;
    const is_optional = field && field.def.optional;
    const enabled = Utils.subblock_is_enabled(field);

    const title = field && (field.def.description || field.def.name);

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="inner-block">

          {title && (
            <div>
              <h4 style={{ cursor: 'pointer', paddingBottom: '0.5rem' }} className="title is-7 is-marginless">
                <span onClick={this.cb__showhide} style={{ display: 'inline-block' }}>
                  {title}

                  {enabled && (
                    <DDToggle is_open={!contents_hidden} cb={this.cb__showhide} />
                  )}
                </span>

                {is_optional && (
                  <span style={{ paddingLeft: '0.3rem', position: 'relative', top: '1px' }}>
                    <Toggle checked={enabled} icons={false} onChange={this.cb__optional_block_toggle} />
                  </span>
                )}
              </h4>
            </div>
          )}

          {enabled && !contents_hidden && (
            <div style={{ paddingBottom: '0.5rem' }}>
              <div className={`otter-box ${this.props.border ? 'otter-box--bordered' : ''}`}
                   style={{ padding: '1rem' }}>
                <div style={{ position: 'relative', paddingTop: this.props.cb_delete ? '0.75rem' : 0 }}>

                  {this.props.cb_delete && (
                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                      <a className="button is-small is-outlined" onClick={this.props.cb_delete}>
                        <span className="icon is-small has-text-grey">
                          <FontAwesomeIcon icon={faTimes} />
                        </span>

                        <span>Delete</span>
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

