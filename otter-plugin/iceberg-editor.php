<?php
  namespace Iceberg\Editor;

  function init() {
    \add_meta_box(
      'iceberg-editor-metabox',
      'Editor',
      '\Iceberg\Editor\render',
      null,
      'normal',
      'high',
      null
    );
  }

  function render($post) {
    require('metabox.php');
  }

  add_action('add_meta_boxes', '\Iceberg\Editor\init');

