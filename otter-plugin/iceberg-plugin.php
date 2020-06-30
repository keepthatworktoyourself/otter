<?php
/**
 * Iceberg-Plugin
 *
 * Plugin Name: Iceberg Editor
 * Plugin URI:  https://wordpress.org/plugins/classic-editor/
 * Description: Iceberg: a declarative block-based editor
 * Version:     0.1
 * Author:      Ben Hallstein
 * Author URI:  https://ben.am/
 * License:     GPLv2 or later
 * License URI: http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: iceberg-plugin
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

  if (class_exists('IcebergPlugin')) {
    return true;
  }

  require_once('classic-editor/classic-editor.php');
  require_once('metabox-init.php');
  require_once('dev-bundle/init.php');

  class IcebergPlugin { }


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


  // iceberg_for_post_type
  // -----------------------------------
  // - must be called on wp init with priority < 100
  // - $post_type can be a single type or an array

  function iceberg_for_post_type($post_type, $bundle_path = null) {
    static $icebergs = [ ];

    if ($bundle_path) {
      if (is_array($post_type)) {
        foreach ($post_type as $p) {
          $icebergs[$p] = $bundle_path;
        }
      }
      else {
        $icebergs[$post_type] = $bundle_path;
      }
    }

    return $icebergs[$post_type] ?? null;
  }


  // set_css_bundle
  // -----------------------------------

  function css_bundle($_bundle_path = null) {
    static $bundle_path = null;

    if ($_bundle_path) {
      $bundle_path = $_bundle_path;
    }

    return $bundle_path;
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

