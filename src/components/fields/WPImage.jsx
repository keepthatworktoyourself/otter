import React from 'react';
import Context__PageData from '../Context__PageData';


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
        <div>
        <input id="file" type="text" ref={this.input_ref} value={field.value} onChange={_ => this.update.call(this, ctx)} />
          <div style={{ width: '12rem', 'height': '12rem', backgroundColor: 'lightblue', border: '1px solid grey' }}>
            {field && (
              <img src={field.value} alt="your preview" style={{'width': '100%'}} />
            )}
          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

