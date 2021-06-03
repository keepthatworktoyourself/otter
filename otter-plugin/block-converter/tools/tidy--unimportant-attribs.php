<?php
  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  function remove_unimportant_attribs($s) {
    // $attribs = ['width', 'height', 'data-secret', 'src', 'href', 'data-width'];
    $attribs = [ ];
    foreach ($attribs as $a) {
      $s = preg_replace("/$a=\"[^\"]+\"/", '', $s);
    }
    return $s;
  }

  $stdin = stream_get_contents(STDIN);
  echo remove_unimportant_attribs($stdin);

