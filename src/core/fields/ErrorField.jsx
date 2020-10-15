import React from 'react';
import FieldLabel from '../other/FieldLabel';


export default function ErrorField(props) {
  return (
    <div className="field">

      <FieldLabel label='Error' is_top_level={props.__is_top_level} />
      <div className="control">
        <p>{props.text}</p>
      </div>

    </div>
  );
};

