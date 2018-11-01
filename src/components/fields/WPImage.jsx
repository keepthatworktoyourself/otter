import React from 'react';
import Context__PageData from '../Context__PageData';
import FieldLabel from './FieldLabel';


export default class FileInput extends React.Component {

  constructor(props) {
    super(props);

    this.input_ref = React.createRef();
  }


  update(ctx) {
    this.props.field.value = this.input_ref.current.value;
    ctx.should_update();
  }


  render() {
    const block = this.props.block;
    const field = this.props.field;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div className="field">
          <div className="is-flex" style={{ alignItems: 'flex-start' }}>

            <div className="is-flex-tablet" style={{ alignItems: 'center'}}>
              <div className="c-label-margin-btm-phone">
                <FieldLabel field={field} block={block} align="left" colon={true} min_width={true} />
              </div>

              <div>
                <a className="button is-small">Select</a>
              </div>
            </div>

            {field.value && (
              <div style={{ display: 'block', width: '5rem', height: '3rem', marginLeft: '1rem' }} className="has-background-light">
                <img src={field.value} alt="your preview" style={{ display: 'block', width: '100%', maxWidth: '5rem', maxHeight: '3rem' }} />
              </div>
            )}

          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

