<?php
  //
  // helpers.php - some helpers for converters to use
  //


  // Dynamically create stdclass models during
  // unserialization
  // ---------------------------------

  function unserialize_helper($class) {
    if (!class_exists($class)) {
      eval("class $class extends stdClass { }");
    }
  }
  ini_set('unserialize_callback_func', 'unserialize_helper');


  function post_url($id) {
    return get_permalink($id);
  }


  function image($image_id) {
    global $pdo;

    $url = wp_get_attachment_url($image_id);
    return $url ? [
      'id'  => $image_id,
      'url' => $url,
    ] : null;
  }


  function media_from_url($item_url) {
    global $pdo;
    if (!$item_url) {
      return null;
    }

    // Calculate the expected _wp_attached_file meta-value
    preg_match('/wp-content\/uploads\/(.+)/', $item_url, $m);
    $attachment_meta = $m[1] ?? null;
    if (!$attachment_meta) {
      return null;
    }

    $st = $pdo->prepare('select post_id from wp_postmeta where meta_key = "_wp_attached_file" && meta_value = ?');
    $r = $st->execute([$attachment_meta]);
    if (!$r) {
      return null;
    }

    $item_id = $st->fetchAll(PDO::FETCH_ASSOC)[0]['post_id'] ?? null;
    return $item_id ? [
      'id'  => $item_id,
      'url' => $item_url,
    ] : null;
  }


  function find_oembed_src($data) {
    if (preg_match_all('/https:\/\/twitter.com\/[^\/]+\/status\/[^\/? "]+/', $data, $m)) {
      return end($m[0]);
    }

    $src = substr($data, strpos($data, 'https'));
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

