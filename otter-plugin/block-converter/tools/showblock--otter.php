<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $post_id = getenv('POSTID');
  $meta_key = getenv('KEY');
  $st = $pdo->prepare("select * from wp_postmeta where meta_key = '$meta_key' and post_id = ?");
  $result = $st->execute([ $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['meta_value']);
    print_r($data);
  }

