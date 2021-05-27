import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

export default function({cb__clear}) {
  return (
    <div className="inline-block">
      <a className="cursor-pointer text-gray-600 hover:text-gray-400" onClick={cb__clear}>
        <FontAwesomeIcon icon={faTimes} />
      </a>
    </div>
  );
};

