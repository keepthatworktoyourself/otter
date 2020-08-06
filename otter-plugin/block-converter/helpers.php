<?php
  //
  // helpers.php - some helpers for converters to use
  //

  function image($image_id) {
    global $pdo;

    $st = $pdo->prepare("select guid from wp_posts where ID = ?");
    $r = $st->execute([$image_id]);
    if (!$r) {
      return null;
    }

    $guid = $st->fetchAll(PDO::FETCH_ASSOC)[0]['guid'] ?? null;
    return $guid ? [
      'id'  => $image_id,
      'url' => $guid,
    ] : null;
  }


  function media_from_url($item_url) {
    global $pdo;

    $st = $pdo->prepare('select ID from wp_posts where guid = ?');
    $r = $st->execute([$item_url]);
    if (!$r) {
      return null;
    }

    $item_id = $st->fetchAll(PDO::FETCH_ASSOC)[0]['ID'] ?? null;
    return $item_id ? [
      'id'  => $item_id,
      'url' => $item_url,
    ] : null;
  }


  function find_oembed_src($data) {
    if (strpos($data, 'https://twitter')) {
      $src = substr($data, strpos($data, 'https://twitter.'));
    }
    else {
      $src = substr($data, strpos($data, 'https'));
    }
    return substr($src, 0, strpos($src, '"'));
  }


  function post_property($postid, $property) {
    global $pdo;

    $st = $pdo->prepare('select ? from wp_posts where ID = ?');
    $r = $st->execute([$property, $postid]);
    if (!$r) {
      return null;
    }

    return $st->fetchAll(PDO::FETCH_ASSOC)[0][$property] ?? null;
  }


  function post_meta($postid, $metakey) {
    global $pdo;

    $st = $pdo->prepare('select meta_value from wp_postmeta where post_id = ? and meta_key = ?');
    $r = $st->execute([$postid, $metakey]);
    if (!$r) {
      return null;
    }

    return $st->fetchAll(PDO::FETCH_ASSOC)[0]['meta_value'] ?? null;
  }

