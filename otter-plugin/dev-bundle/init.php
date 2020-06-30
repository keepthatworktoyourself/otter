<?php
  add_action('init', function() {
    \Iceberg\iceberg_for_post_type('post', '../dev-bundle/dist/blockset.js');
    \Iceberg\css_bundle('../dev-bundle/dist/blockset.css');
  });

