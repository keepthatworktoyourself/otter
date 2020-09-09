<?php
  //
  // get-initial.php
  // - bulk download pages to current directory
  //
  // docker exec -i wpbw php -d memory_limit=512M \
  //  < /Users/ben/Desktop/tests/get-initial/dl-all.php \
  //  | bash
  //

  $path_wpconfig = getenv('WPCONFIG');
  if (!$path_wpconfig) {
    echo "Please define WPCONFIG as the path to wp-config.php\n";
    exit;
  }

  require_once($path_wpconfig);

  $q = new WP_Query([
    'post_type'      => 'bw_landing_page',
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

  $cmds = [ ];
  $n = count($urls);
  foreach ($urls as $i => $url) {
    $j = $i + 1;
    $fn = preg_replace('/[^a-zA-Z0-9]/', '-', $url);
    $cmds []= "echo -n '$j of $n  ' && echo '$fn' && curl -sL $url > $fn.html";
  }

  echo implode($cmds, " && "), "\n";
