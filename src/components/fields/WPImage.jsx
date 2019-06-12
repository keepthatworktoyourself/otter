import React from 'react';
import Context__PageData from '../Context__PageData';


export default class FileInput extends React.Component {

  constructor(props) {
    super(props);

    this.input_ref = React.createRef();
    this.props.data_channel.handler = this.get_data.bind(this);
  }


  get_data() {
    return this.input_ref.current.value;
  }


  render() {
    const field = this.props.field;
    const field_def = this.props.field_definition;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div>
          <input id="file" type="text" ref={this.input_ref} value={field} onChange={ctx.should_update} />
          <div style={{ width: '12rem', 'height': '12rem', backgroundColor: 'lightblue', border: '1px solid grey' }}>
            {field && (
              <img src={field} style={{'width': '100%'}} />
            )}
          </div>
        </div>
      )}</Context__PageData.Consumer>
    );
  }
}

