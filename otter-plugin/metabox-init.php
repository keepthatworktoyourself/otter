<?php
  namespace Otter\Editor;

  function init() {
    $proceed = is_admin() && \Otter\otter_for_post_type(get_post_type());
    if ($proceed) {
      \add_meta_box(
        'otter-editor-metabox',
        'Otter Editor',
        '\Otter\Editor\render',
        null,
        'normal',
        'high',
        null
      );
    }
  }

  function render($post) {
    require('metabox.php');
  }

  add_action('add_meta_boxes', '\Otter\Editor\init', 100);

