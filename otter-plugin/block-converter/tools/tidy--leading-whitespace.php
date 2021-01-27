<?php
  function remove_leading_whitespace($s) {
    return preg_replace('/\n\s+/', "\n", $s);
  }

  $stdin = stream_get_contents(STDIN);
  echo remove_leading_whitespace($stdin);

