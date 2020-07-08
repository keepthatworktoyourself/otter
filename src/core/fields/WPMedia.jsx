import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';


export default class WPMedia extends React.Component {

  constructor(props) {
    super(props);
    this.input_ref = React.createRef();

    this.cb_click = this.cb_click.bind(this);
    this.cb_clear = this.cb_clear.bind(this);
  }


  update(ctx) {
    this.props.field.value = this.input_ref.current.value;
    ctx.should_update();
  }


  image_selection__bind(ctx, field) {
    function cb(ev) {
      const proceed = ev.data && ev.data['otter--set-wp-media-item'];
      if (proceed) {
        ev.stopPropagation();

        field.value = ev.data['otter--set-wp-media-item'];
        ctx.should_update();

        window.removeEventListener('message', cb);
      }
    }

    window.addEventListener('message', cb);
  }


  open_media_browser(field) {
    window.parent && window.parent.postMessage({
      'otter--get-wp-media-item': field.def.media_types || [],
    });
  }


  cb_click(ev) {
    this.image_selection__bind(this.ctx, this.props.field);
    this.open_media_browser(this.props.field);
  }


  cb_clear() {
    this.props.field.value = null;
    this.ctx.should_update();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    return (
      <PageDataContext.Consumer>{ctx => (this.ctx = ctx) && (
        <div className="field">
          <div style={{ paddingRight: '7rem' }}>

            <div className="level is-mobile" style={{ alignItems: 'flex-start' }}>

              <div className="level-item flex-start">
                <FieldLabel field={field} block={block} align="left" colon={true} />
              </div>

              <div className="level-item flex-start">
                <div className="level is-mobile" style={{ alignItems: 'flex-start' }}>
                  {field.value && (
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
                          <img src={field.value.thumbnail || field.value.url} alt="your preview"
                               style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                    </div>
                  )}

                  <div className="level-item flex-start">
                    <a className="button is-small" onClick={this.cb_click}>Select</a>
                  </div>

                  {field.value && (
                    <div className="level-item flex-start">
                      <a className="button is-rounded is-small is-light has-text-grey-light" onClick={this.cb_clear}>
                        <FontAwesomeIcon icon={faTimes} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>{/* level */}

          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }
}

