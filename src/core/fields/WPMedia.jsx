import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class WPMedia extends React.Component {

  constructor(props) {
    super(props);

    this.cb_click = this.cb_click.bind(this);
    this.cb_clear = this.cb_clear.bind(this);
  }


  image_selection__bind(ctx, containing_data_item, field_def) {
    function cb(ev) {
      const proceed = ev.data && ev.data['otter--set-wp-media-item'];
      if (proceed) {
        ev.stopPropagation();

        containing_data_item[field_def.name] = ev.data['otter--set-wp-media-item'];
        ctx.value_updated();
        ctx.should_redraw();

        window.removeEventListener('message', cb);
      }
    }

    window.addEventListener('message', cb);
  }


  open_media_browser(field_def) {
    window.parent && window.parent.postMessage({
      'otter--get-wp-media-item': field_def.media_types || [],
    }, '*');
  }


  cb_click(ev) {
    this.image_selection__bind(this.ctx, this.props.containing_data_item, this.props.field_def);
    this.open_media_browser(this.props.field_def);
  }


  cb_clear() {
    this.props.containing_data_item[this.props.field_def.name] = null;
    this.ctx.value_updated();
    this.ctx.should_redraw();
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const value                = containing_data_item[field_def.name];
    const label                = field_def.description || Utils.humanify_str(field_def.name);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div style={{ paddingRight: '7rem' }}>

            <div className="level is-mobile" style={{ alignItems: 'flex-start' }}>

              <div className="level-item flex-start">
                <FieldLabel label={label} is_top_level={is_top_level} colon={true} />
              </div>

              <div className="level-item flex-start">
                <div className="level is-mobile" style={{ alignItems: 'flex-start' }}>
                  {value && (
                    <div className="level-item flex-start">
                        <div style={{
                               display: 'block',
                               minWidth: '3.5rem',
                               width: '3.5rem',
                               height: '3.5rem',
                               textAlign: 'center',
                               border: '1px solid rgba(0,0,0,0.1)'
                             }}
                             className="has-background-light">
                          <img src={value.thumbnail || value.url} alt="WPMedia image preview"
                               style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                    </div>
                  )}

                  <div className="level-item flex-start">
                    <a className="wpmedia-select-btn button is-small" onClick={this.cb_click}>Select</a>
                  </div>

                  {value && (
                    <div className="level-item flex-start">
                      <a className="wpmedia-clear-btn button is-rounded is-small is-light has-text-grey-light"
                         onClick={this.cb_clear}>
                        <FontAwesomeIcon icon={faTimes} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>{/* level */}

          </div>
        </div>
      )}</ContextConsumer>
    );
  }
}

