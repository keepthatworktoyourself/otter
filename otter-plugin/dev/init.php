<?php
  add_action('init', function() {
    \Otter\set_css_bundle_path('../dev/dist/blocks.css');
    \Otter\mk_editor('post', [
      'bundle_path'   => '../dev/dist/blocks.js',
      'meta_key'      => 'otter-data',
      'metabox_title' => 'My otter editor',
    );
  });

  add_action('init', function() {
    \Otter\dynamic_data('icons', [
      'set'   => 'set',
      'icons' => 'icons',
      'in'    => 'in',
      'php'   => 'php',
      'init'  => 'init',
    ]);

    \Otter\dynamic_data('forms', [
      'all'   => 'all',
      'the'   => 'the',
      'forms' => 'forms',
      'in'    => 'in',
      'world' => 'world',
    ]);

    \Otter\dynamic_data('hardcoded_forms', [
      'set'  => 'set',
      'at'   => 'at',
      'php'  => 'php',
      'init' => 'init',
    ]);
  });

