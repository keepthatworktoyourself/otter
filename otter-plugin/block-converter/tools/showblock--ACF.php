<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $block = getenv('BLOCK');
  $st = $pdo->prepare("select * from pb_blocks where data like '%$block%' order by post_id desc limit 1");
  $result = $st->execute();

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['data']);
    print_r($data);
  }

