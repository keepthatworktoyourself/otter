<?php
/**
 * Otter-Plugin
 *
 * Plugin Name: Otter Editor
 * Plugin URI:  https://wordpress.org/plugins/classic-editor/
 * Description: Otter: a declarative block-based editor
 * Version:     0.1
 * Author:      Ben Hallstein
 * Author URI:  https://ben.am/
 * License:     GPLv2 or later
 * License URI: http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: otter-plugin
 * Domain Path: /languages
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

  namespace Otter;

  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  if (class_exists('OtterPlugin')) {
    return true;
  }

  require_once('classic-editor/classic-editor.php');
  require_once('metabox-init.php');
  require_once('dev/init.php');

  class OtterPlugin { }


  // save()
  // -----------------------------------

  function save($post_id, array $data) {
    return update_post_meta($post_id, 'otter-content', $data);
  }


  // load()
  // -----------------------------------

  function load($post_id) {
    return get_post_meta($post_id, 'otter-content', true);
  }


  // otter_for_post_type
  // -----------------------------------
  // - must be called on wp init with priority < 100
  // - $post_type can be a single type or an array

  function otter_for_post_type($post_type, $bundle_path = null) {
    static $otters = [ ];

    if ($bundle_path) {
      if (is_array($post_type)) {
        foreach ($post_type as $p) {
          $otters[$p] = $bundle_path;
        }
      }
      else {
        $otters[$post_type] = $bundle_path;
      }
    }

    if (is_string($post_type)) {
      return $otters[$post_type] ?? null;
    }
    return null;
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
    preg_match('/otter-data=([^&]+)/', file_get_contents('php://input'), $m);

    if ($m) {
      $arr = json_decode(urldecode($m[1]), true);
      if ($arr) {
        save($post_id, $arr);
      }
    }
  });

