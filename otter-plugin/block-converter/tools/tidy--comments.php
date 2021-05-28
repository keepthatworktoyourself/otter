<?php
  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  function remove_comments($s) {
    $s = preg_replace('/<!--.+-->/', '', $s);
    var_dump($s);
    return $s;
  }

  $stdin = stream_get_contents(STDIN);
  echo remove_comments($stdin);

