<?php
  add_action('init', function() {
    \Otter\otter_for_post_type('post', '../dev-bundle/dist/blocks.js');
    \Otter\css_bundle('../dev-bundle/dist/blocks.css');
  });

