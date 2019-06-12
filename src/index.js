import React from 'react';
import ReactDOM from 'react-dom';
import PostBuilder from './components/PostBuilder';
import './index.css';
import './quill.snow.css';

function query_data() {
  const q = window.location.search;
  if (!q || !q.length) {
    return null;
  }

  return q.substr(1).split('&')
    .reduce(function(accum, item, i) {
      const parts = item.split('=');
      accum[parts[0]] = parts[1];
      return accum;
    }, { });
}

function post_id() {
  const data = query_data();
  return data ? (data.post_id || null) : null;
}


ReactDOM.render(
  <PostBuilder title='Post builder' post_id={post_id()} />,
  document.getElementById('root')
);

