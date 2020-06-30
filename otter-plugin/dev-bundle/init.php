<?php
  add_action('init', function() {
    \Otter\otter_for_post_type('post', '../dev-bundle/dist/blockset.js');
    \Otter\css_bundle('../dev-bundle/dist/blockset.css');
  });

