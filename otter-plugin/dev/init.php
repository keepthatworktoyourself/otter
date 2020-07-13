<?php
  add_action('init', function() {
    \Otter\otter_for_post_type('post', '../dev/dist/blocks.js');
    \Otter\css_bundle('../dev/dist/blocks.css');
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

