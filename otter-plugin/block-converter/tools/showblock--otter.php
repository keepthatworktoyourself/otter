<?php
  $pdo = new PDO('mysql:dbname=bwen;host=127.0.0.1', 'iceberg', 'iceberg');
  $block = getenv('BLOCK');
  $st = $pdo->prepare("select * from wp_postmeta where meta_key = 'otter-content' and meta_value like '%$block%' order by post_id desc limit 1");
  $result = $st->execute();

  if ($result) {
    $r = $st->fetchAll(PDO::FETCH_ASSOC)[0];
    $data = unserialize($r['meta_value']);
    var_dump($data);
  }
