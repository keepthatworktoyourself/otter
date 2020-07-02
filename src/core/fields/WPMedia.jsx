import React from 'react';
import FieldLabel from './FieldLabel';
import PageDataContext from '../PageDataContext';


export default class WPMedia extends React.Component {

  constructor(props) {
    super(props);
    this.input_ref = React.createRef();
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


  cb_click(ctx, field) {
    this.image_selection__bind(ctx, field);
    this.open_media_browser(field);
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    return (
      <PageDataContext.Consumer>{ctx => (
        <div className="field">
          <div className="is-flex" style={{ alignItems: 'flex-start' }}>

            <div className="is-flex" style={{ alignItems: 'center'}}>
              <div className="c-label-margin-btm-phone">
                <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
              </div>

              <div>
                <a className="button is-small" onClick={_ => this.cb_click.call(this, ctx, field)}>Select</a>
              </div>
            </div>

            {field.value && (
              <div style={{
                     display: 'block',
                     width: '3.5rem', height: '3.5rem',
                     marginLeft: '1rem',
                     textAlign: 'center',
                     border: '1px solid rgba(0,0,0,0.1)'
                   }}
                   className="has-background-light">
                <img src={field.value.thumbnail || field.value.url} alt="your preview"
                     style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
            )}

          </div>
        </div>
      )}</PageDataContext.Consumer>
    );
  }
}

