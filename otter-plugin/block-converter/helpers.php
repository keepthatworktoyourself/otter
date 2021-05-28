<?php
  namespace Otter;

  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }


  // The following are helper functions for use by converters
  // ---------------------------------

  function post_url($id) {
    return get_permalink($id);
  }


  function image($image_id) {
    $url = wp_get_attachment_url($image_id);
    return $url ? [
      'id'  => $image_id,
      'url' => $url,
    ] : null;
  }


  function files_with_extension($directory, $ext) {
    $files = array_filter(scandir("$directory"), function($file) use ($ext) {
      return preg_match("/\.$ext$/", $file);
    });
    sort($files);
    return $files;
  }


  function media_from_url($item_url) {
    if (!$item_url) {
      return null;
    }

    // Calculate the expected _wp_attached_file meta-value
    preg_match('/wp-content\/uploads\/(.+)/', $item_url, $m);
    $attachment_meta = $m[1] ?? null;
    if (!$attachment_meta) {
      return null;
    }

    $st = Transition::$pdo->prepare('select post_id from wp_postmeta where meta_key = "_wp_attached_file" && meta_value = ?');
    $r = $st->execute([$attachment_meta]);
    if (!$r) {
      return null;
    }

    $item_id = $st->fetchAll(\PDO::FETCH_ASSOC)[0]['post_id'] ?? null;
    return $item_id ? [
      'id'  => $item_id,
      'url' => $item_url,
    ] : null;
  }


  function find_oembed_src($data) {
    if (preg_match_all('/https?:\/\/twitter.com\/[^\/]+\/status\/[^\/? "]+/', $data, $m)) {
      return end($m[0]);
    }

    if (preg_match('/"https?:\/\/www\.youtube\.com\/embed\/([^?"]+)/', $data, $m)) {
      return "https://www.youtube.com/watch?v={$m[1]}";
    }

    $src = substr($data, strpos($data, 'http'));
    return substr($src, 0, strpos($src, '"'));
  }


  function post_property($postid, $property) {
    $st = Transition::$pdo->prepare('select ? from wp_posts where ID = ?');
    $r = $st->execute([$property, $postid]);
    if (!$r) {
      return null;
    }

    return $st->fetchAll(\PDO::FETCH_ASSOC)[0][$property] ?? null;
  }


  function post_meta($postid, $metakey) {
    $st = Transition::$pdo->prepare('select meta_value from wp_postmeta where post_id = ? and meta_key = ?');
    $r = $st->execute([$postid, $metakey]);
    if (!$r) {
      return null;
    }

    return $st->fetchAll(\PDO::FETCH_ASSOC)[0]['meta_value'] ?? null;
  }


  // is_obj
  // ---------------------------------

  function is_obj($x) {
    return gettype($x) === 'object';
  }

