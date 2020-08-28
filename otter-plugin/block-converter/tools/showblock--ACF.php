<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $post_id = getenv('POSTID');
	var_dump($post_id);
  $st = $pdo->prepare('select * from pb_blocks where post_id = ?');
  $result = $st->execute([ $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['data']);
    print_r($data);
  }

