<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $post_id = getenv('POSTID');
  $st = $pdo->prepare('select uncompress(data) as data from pb_blocks where post_id = ?');
  $result = $st->execute([ $post_id ]);

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    print_r(json_decode($r['data']));
  }

