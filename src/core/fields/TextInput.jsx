import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';


export default class TextInput extends React.Component {

  constructor(props) {
    super(props);
    this.cb_change = this.cb_change.bind(this);
  }


  cb_change(ev) {
    this.props.containing_data_item[this.props.field_def.name] = ev.target.value;
    this.setState({});
    this.ctx.value_updated();
  }


  render() {
    const field_def            = this.props.field_def;
    const containing_data_item = this.props.containing_data_item;
    const is_top_level         = this.props.is_top_level;
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer;
    const value                = containing_data_item[field_def.name] || '';

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">

          <FieldLabel label={field_def.description || field_def.name} is_top_level={is_top_level} />

          <div className="control">
            <input type="text" className="input" value={value} onChange={this.cb_change} />
          </div>

        </div>
      )}</ContextConsumer>
    );
  }

}

