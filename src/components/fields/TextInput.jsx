import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from './FieldLabel';


export default class TextInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: props.field.value || '' };
    this.cb_change = this.cb_change.bind(this);
  }


  cb_change(ev) {
    this.props.field.value = ev.currentTarget.value;
    this.setState({ value: ev.currentTarget.value });
  }


  render() {
    return (
      <PageDataContext.Consumer>{(ctx) => (
        <div className="field" key={this.props.field.uid}>

          {(this.ctx = ctx) && ''}
          <FieldLabel field={this.props.field} block={this.props.block} />
          <div className="control">
            <input type="text" className="input" value={this.state.value} onChange={this.cb_change} />
          </div>

        </div>
      )}</PageDataContext.Consumer>
    );
  }

}

