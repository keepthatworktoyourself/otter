import React from 'react';
import Context__PageData from '../Context__PageData';


export default class Bool extends React.Component {

  constructor(props) {
    super(props);

    this.input_ref = React.createRef();
    this.props.data_channel.handler = this.get_data.bind(this);
  }


  get_data() {
    return this.input_ref.current.checked;
  }


  render() {
    const field = this.props.field;
    const field_def = this.props.field_definition;

    return (
      <Context__PageData.Consumer>{(ctx) => (
        <div>
          <input type="checkbox" ref={this.input_ref} checked={field} onChange={ctx.should_update} />
        </div>
      )}</Context__PageData.Consumer>
    );
  }

}

