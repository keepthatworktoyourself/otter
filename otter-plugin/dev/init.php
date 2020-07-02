<?php
  add_action('init', function() {
    \Otter\otter_for_post_type('post', '../dev/dist/blocks.js');
    \Otter\css_bundle('../dev/dist/blocks.css');
  });

