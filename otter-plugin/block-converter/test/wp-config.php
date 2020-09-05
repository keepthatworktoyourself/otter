<?php
  define(DB_NAME, 'temp__block_converter');
  define(DB_HOST, '127.0.0.1');
  define(DB_USER, 'block_converter');
  define(DB_PASSWORD, 'block_converter');


  function test_load_function($post_id) {
    global $pdo;
    $st = $pdo->prepare('select data from data_before where post_id = ?');
    $r = $st->execute([$post_id]);
    if (!$r) {
      return null;
    }

    $item = $st->fetchAll(PDO::FETCH_ASSOC)[0] ?? null;
    return $item ? unserialize($item['data']) : null;
  }

  function get_permalink() {

  }

