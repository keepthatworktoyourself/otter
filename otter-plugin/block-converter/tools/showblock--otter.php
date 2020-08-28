<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $post_id = getenv('POSTID');
	var_dump($post_id);
  $st = $pdo->prepare("select * from wp_postmeta where meta_key = 'otter-content' and post_id = ?");
  $result = $st->execute([ $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['meta_value']);
    var_dump($data);
  }

