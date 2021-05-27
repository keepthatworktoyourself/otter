import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import styles from '../definitions/styles';

export default function({cb__delete, classes}) {
  return (
    <a className={`absolute block ${styles.button} ${styles.button_pad__sm} ${styles.control_bg} ${styles.control_border} ${styles.control_border__interactive}, ${classes}`}
       onClick={cb__delete}
    >
      <FontAwesomeIcon icon={faTimes} />
    </a>
  );
};

