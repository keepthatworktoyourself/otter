<?php
  namespace Otter\Editor;

  function init() {
    $editors = \Otter\mk_editor(get_post_type());
    $proceed = is_admin() && $editors;

    if ($proceed) {
      foreach ($editors as $editor_info) {
        \add_meta_box(
          "otter-editor-metabox--{$editor_info['meta_key']}",
          $editor_info['metabox_title'] ?? 'Otter Editor',
          '\Otter\Editor\render',
          null,
          'normal',
          'high',
          ['editor_info' => $editor_info]
        );
      }
    }
  }

  function render($post, $box) {
    $editor_info = $box['args']['editor_info'];
    require('metabox.php');
  }

  add_action('add_meta_boxes', '\Otter\Editor\init', 100);

