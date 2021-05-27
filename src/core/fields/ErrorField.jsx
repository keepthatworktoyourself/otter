import React from 'react';
import FieldLabel from '../other/FieldLabel';
import styles from '../definitions/styles'

export default function ErrorField(props) {
  return (
    <div className={styles.field}>
      <FieldLabel label='Error' is_top_level={props.__is_top_level} />
      <p>{props.text}</p>
    </div>
  );
};

