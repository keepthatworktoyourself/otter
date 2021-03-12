<?php
  $wpconfig = getenv('WPCONFIG');
  $post_id = getenv('POSTID');

  if (!($wpconfig && $post_id)) {
    echo 'Please set env vars: WPCONFIG & POSTID', "\n";
    exit;
  }

  require_once($wpconfig);

  $db = constant('DB_NAME');
  $db_user = constant('DB_USER');
  $db_pass = constant('DB_PASSWORD');
  $db_host = constant('DB_HOST');

  $pdo = new PDO("mysql:dbname=$db;host=$db_host", $db_user, $db_pass);
  $st = $pdo->prepare('select uncompress(data) as data from pb_blocks where post_id = ?');
  $result = $st->execute([ $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    print_r(json_decode($r['data']));
  }

