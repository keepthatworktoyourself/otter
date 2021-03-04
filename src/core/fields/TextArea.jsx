import React from 'react';
import PageDataContext from '../PageDataContext';
import FieldLabel from '../other/FieldLabel';
import Utils from '../definitions/utils';


export default class TextArea extends React.Component {

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
    const value                = containing_data_item[field_def.name];
    const mono                 = field_def.mono || false;
    const label                = field_def.description || Utils.humanify_str(field_def.name);

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className="field">

          <FieldLabel label={label} is_top_level={is_top_level} />

          <textarea className={`textarea ${mono ? 'otter-monospace': ''}`}
                    style={mono ? { fontSize: '0.9em' } : {}}
                    ref={this.textarea_ref} value={value || ''} onChange={this.cb_change} />

        </div>
      )}</ContextConsumer>
    );
  }

}

