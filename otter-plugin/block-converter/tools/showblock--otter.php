<?php
  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  $wpconfig = getenv('WPCONFIG');
  $post_id = getenv('POSTID');
  $meta_key = getenv('METAKEY');

  if (!($wpconfig && $post_id && $meta_key)) {
    echo 'Please set env vars: WPCONFIG, POSTID, and METAKEY', "\n";
    exit;
  }

  require_once($wpconfig);

  $db = constant('DB_NAME');
  $db_user = constant('DB_USER');
  $db_pass = constant('DB_PASSWORD');
  $db_host = constant('DB_HOST');

  $pdo = new PDO("mysql:dbname=$db;host=$db_host", $db_user, $db_pass);
  $st = $pdo->prepare("select * from wp_postmeta where meta_key = ? and post_id = ?");
  $result = $st->execute([ $meta_key, $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['meta_value']);
    print_r($data);
  }

