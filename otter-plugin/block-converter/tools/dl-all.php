<?php
  //
  // get-initial.php
  // - bulk download pages to current directory
  //
  // docker exec -i wpbw php -d memory_limit=512M \
  //  < /Users/ben/Desktop/tests/get-initial/dl-all.php \
  //  | bash
  //

  require_once('/var/www/html/wp-config.php');

  $q = new WP_Query([
    'post_type' => 'bw_landing_page',
    'posts_per_page' => -1,
  ]);

  $urls = call_user_func(function() use ($q) {
    $out = [ ];
    while ($q->have_posts()) {
      $q->the_post();
      $permalink = get_permalink();
      if (substr($permalink, -1) === '/') {
        $permalink = substr($permalink, 0, -1);
      }
      $out []= $permalink;
    }
    return $out;
  });

  $cmds = array_map(function($url) {
    $fn = preg_replace('/[^a-zA-Z0-9]/', '-', $url);
    return "curl -L $url > $fn.html";
  }, $urls);

  echo implode($cmds, " && "), "\n";

