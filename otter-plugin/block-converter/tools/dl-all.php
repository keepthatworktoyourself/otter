<?php
  //
  // get-initial.php
  // - bulk download pages to current directory
  //
  // docker exec -i wpbw php -d memory_limit=512M \
  //  < /Users/ben/Desktop/tests/get-initial/dl-all.php \
  //  | bash
  //

  // Opts
  // ---------------------------------------

  $path_wpconfig = getenv('WPCONFIG');
  if (!$path_wpconfig) {
    echo "Please define WPCONFIG as the path to wp-config.php\n";
    exit;
  }

  $n = getenv('N');
  if (!$n) {
    $n = -1;
  }

  $post_type = getenv('POSTTYPE');
  if (!$post_type) {
    $post_type = 'post';
  }

  $append_to_url = getenv('APPEND');


  // Generate cmd
  // ---------------------------------------

  require_once($path_wpconfig);

  $q = new WP_Query([
    'post_type'           => $post_type,
    'posts_per_page'      => $n,
    'paged'               => 0,
    'ignore_sticky_posts' => true,
    'orderby'             => 'ID',
    'order'               => 'DESC',
    'post_status'         => 'publish',
  ]);

  $urls = call_user_func(function() use ($q, $append_to_url) {
    $out = [ ];
    while ($q->have_posts()) {
      $q->the_post();
      $permalink = get_permalink();
      if (substr($permalink, -1) === '/') {
        $permalink = substr($permalink, 0, -1);
      }
      if ($append_to_url) {
        $permalink .= $append_to_url;
      }
      $out []= $permalink;
    }
    return $out;
  });

  $cmds = [ ];
  $n = count($urls);
  $dir = __DIR__;
  $tidy = "| php $dir/tidy--leading-whitespace.php " .
    "| php $dir/tidy--comments.php " .
    "| php $dir/tidy--unimportant-attribs.php";
  foreach ($urls as $i => $url) {
    $j = $i + 1;
    $fn = preg_replace('/[^a-zA-Z0-9]/', '-', $url);
    $cmds []= "echo -n '$j of $n  ' && echo '$fn' && curl -sL $url $tidy > $fn.html";
  }

  echo implode($cmds, " && "), "\n";

