<?php
  namespace Otter\Editor;

  function init() {
    $editors = \Otter\editor(get_post_type());
    $proceed = is_admin() && $editors;

    if ($proceed) {
      foreach ($editors as $editor_info) {
        \add_meta_box(
          "otter-editor-metabox--{$editor_info['meta_key']}",
          $editor_info['metabox_title'] ?? 'Otter Editor',
          '\Otter\Editor\render',
          null,
          'otter__after_title',
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

  add_action('edit_form_after_title', function() {
    global $post, $wp_meta_boxes;
    do_meta_boxes(get_current_screen(), 'otter__after_title', $post);
  });

