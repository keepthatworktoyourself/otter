<?php
/**
 * Otter-Plugin
 *
 * Plugin Name: Otter Editor
 * Plugin URI:  https://wordpress.org/plugins/classic-editor/
 * Description: Otter Editor: Declarative. Easy. Fast.
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
  // require_once('dev/init.php');

  class OtterPlugin { }


  // save()
  // -----------------------------------

  function save($post_id, $meta_key, array $data) {
    return update_post_meta($post_id, $meta_key, $data);
  }


  // load()
  // -----------------------------------

  function load($post_id, $meta_key) {
    $result = get_post_meta($post_id, $meta_key, true);
    return $result ? $result : [ ];
  }


  // mk_editor - call on wp init
  // -----------------------------------
  // - call on wp init
  // - priority must be < 100
  // - editor_info: [  bundle_path => '...', meta_key => '...' ]
  // - $post_type can be a single type or an array

  function mk_editor($post_type, $editor_info = null) {
    static $otters = [ ];

    if ($editor_info) {
      if (!isset($editor_info['bundle_path']) || !isset($editor_info['meta_key'])) {
        throw new \RuntimeException(
          "\Otter\mk_editor($post_type, $editor_info):\n" .
          "\$post_type: string or array\n" .
          "\$editor_info requires: [\n" .
          "  'bundle_path'   => '...',\n" .
          "  'meta_key'      => '...',\n" .
          "  'metabox_title' => '...',  (optional)\n" .
          "]"
        );
      }

      $post_types = is_array($post_type) ? $post_type : [$post_type];
      foreach ($post_types as $p) {
        $otters[$p] []= $editor_info;
      }
    }

    if (is_string($post_type)) {
      return $otters[$post_type] ?? null;
    }

    return null;
  }


  // set_css_bundle_path
  // -----------------------------------

  function set_css_bundle_path($_bundle_path = null) {
    static $bundle_path = null;

    if ($_bundle_path) {
      $bundle_path = $_bundle_path;
    }

    return $bundle_path;
  }


  // dynamic_data
  // -----------------------------------

  function dynamic_data($name = null, $value = null) {
    static $dynamic_data = [ ];

    if ($name && $value) {
      $dynamic_data[$name] = $value;
    }

    return $dynamic_data;
  }


  // hook
  // -----------------------------------

  add_action('save_post', function($post_id) {
    $input = file_get_contents('php://input');

    preg_match_all('/otter-data--[^&]+/', $input, $m, PREG_PATTERN_ORDER);

    if (!$m) {
      return;
    }

    foreach ($m[0] as $match) {
      preg_match('/^otter-data--([^=]+)=([^&]+)/', $match, $mm);

      $meta_key = $mm[1];
      $data     = $mm[2];

      $arr = json_decode(urldecode($data), true);
      if ($arr) {
        save($post_id, $meta_key, $arr);
      }
    }
  });

