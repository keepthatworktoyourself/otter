import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';


export default function DDToggle(props) {
  const l_margin = props.marginLeft || '0.3rem';

  const attrs = {
    style: {
      marginLeft: l_margin,
      transform: `rotate(${props.is_open ? '180' : '0'}deg)`
    },
  };

  return (
    <span className="icon c-toggler-icon"
          onClick={props.cb || null}
          {...attrs}>
      <FontAwesomeIcon icon={faChevronDown} />
    </span>
  );
}

