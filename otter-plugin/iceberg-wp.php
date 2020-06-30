<?php
/**
 * Iceberg-WP
 *
 * Plugin Name: Iceberg Editor
 * Plugin URI:  https://wordpress.org/plugins/classic-editor/
 * Description: Iceberg: a declarative block-based editor
 * Version:     0.1
 * Author:      Ben Hallstein
 * Author URI:  https://ben.am/
 * License:     GPLv2 or later
 * License URI: http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: iceberg-wp
 * Domain Path: /languages
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

  namespace Iceberg;

  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  if (class_exists('Iceberg')) {
    return true;
  }

  require_once('classic-editor/classic-editor.php');
  require_once('iceberg-editor.php');


  // serialize()
  // -----------------------------------

  function serialize($data) {
    return json_encode($data, JSON_UNESCAPED_SLASHES);
  }


  // save()
  // -----------------------------------

  function save($post_id, array $data) {
    return update_post_meta($post_id, 'iceberg-content', \Iceberg\serialize($data));
  }


  // load()
  // -----------------------------------

  function load($post_id) {
    $result = get_post_meta($post_id, 'iceberg-content', true);
    try {
      $result = json_decode($result, true);
    }
    catch (\Throwable $exc) {
      error_log("iceberg could not decode data for post $post_id");
    }
    finally {
      return $result;
    }
  }


  // hook
  // -----------------------------------

  add_action('save_post', function($post_id) {
    $data = $_POST['iceberg-data'] ?? null;
    if ($data) {
      $data = preg_replace('/\\\"/', '"', $data);
      $arr = json_decode($data, true);
      if ($arr) {
        save($post_id, $arr);
      }
    }
  });

