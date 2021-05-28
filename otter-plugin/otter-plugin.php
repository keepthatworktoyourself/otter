<?php
/**
 * Otter-Plugin
 *
 * Plugin Name: Otter Editor
 * Plugin URI:  https://github.com/bhallstein/otter
 * Description: Rapidly prototype and create rich content editing experiences for your wordpres site.
 * Version:     1.0.0
 * Author:      Ben Hallstein
 * Author URI:  https://github.com/bhallstein
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

  require_once('metabox-init.php');
  require_once('block-converter/block-converter.php');
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


  // editor
  // -----------------------------------
  // - call on wp init
  // - priority must be < 100
  // - editor_opts: [ bundle_path => '...', meta_key => '...', metabox_title => '...' ]
  // - $post_type can be a single type or an array

  function editor($post_type, $editor_opts = null) {
    static $otters = [ ];

    if ($editor_opts) {
      if (!isset($editor_opts['bundle_path']) || !isset($editor_opts['meta_key'])) {
        throw new \RuntimeException(
          '\Otter\editor($post_type, $editor_opts):'    . "\n" .
          ' - $post_type: string or array'              . "\n" .
          ' - $editor_opts: ['                          . "\n" .
          '     "bundle_path"   => string,'             . "\n" .
          '     "meta_key"      => string,'             . "\n" .
          '     "metabox_title" => string,  (optional)' . "\n" .
          '   ]'
        );
      }

      $post_types = is_array($post_type) ? $post_type : [$post_type];
      foreach ($post_types as $p) {
        $otters[$p] []= $editor_opts;
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


  // hook for updates
  // -----------------------------------

  function autotransition($version = null, $transition_directory = null) {
    static $transitions = [ ];
    if ($version) {
      $transitions []= [
        'version'   => $version,
        'directory' => $transition_directory,
      ];
    }
    return $transitions;
  }

  function get_transitions($version__db, $version__code) {
    $transitions = autotransition();
    usort($transitions, function($t1, $t2) {
      return $t2['version'] - $t1['version'];
    });
    return array_filter($transitions, function($t) use ($version__db, $version__code) {
      return $t['version'] > $version__db && $t['version'] <= $version__code;
    });
  }

  function acquire_lock($pdo, $lock_name) {
    $lock = $pdo->query("select get_lock('$lock_name', 0) as l");
    $result = $lock->fetchAll(\PDO::FETCH_ASSOC)[0]['l'] ?? null;
    return $result === '1';
  }

  function release_lock($pdo, $lock_name) {
    $unlock = $pdo->query("select release_lock('$lock_name') as l");
  }


  add_action('init', function($muffins) {
    global $wpdb;

    $lock_name = 'otter-update';
    $version__code = @constant('OTTER_DATA_VERSION');
    $version__db = get_option('otter-data-version');

    if ($version__code === null) {  // App is not using versions
      return;
    }

    $version__code = (float) $version__code;
    $version__db   = (float) $version__db;

    if ($version__db > $version__code) {
      echo "Warning: DB content version ($version__db) more recent than codebase content version ($version__code)!";
      return;
    }

    $transitions = get_transitions($version__db, $version__code);
    if (count($transitions) === 0) {  // Nothing to do
      return;
    }

    try {
      Transition::$pdo = new \PDO(
        "mysql:dbname={$wpdb->dbname};host={$wpdb->dbhost};charset=utf8",
        $wpdb->dbuser,
        $wpdb->dbpassword,
        [ \PDO::MYSQL_ATTR_FOUND_ROWS => true ]
      );
      Transition::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
      Transition::$pdo->exec('set names utf8mb4 collate utf8mb4_unicode_ci');

      $lock = acquire_lock(Transition::$pdo, $lock_name);
      if (!$lock) {  // Update task is running in a different process
        echo 'The website is currently running a database update. Please check back in a few seconds. 🦦';
        exit;
      }

      foreach ($transitions as $t) {
        \Otter\run_transition($t['directory']);
      }

      update_option('otter-data-version', $version__code);
    }
    catch (\PDOException $exc) {
      ob_start();
      echo "Database error during transitioning";
      var_dump($exc);
      $err = ob_get_clean();

      echo $err;
      error_log($err);
      exit;
    }
    catch (\Exception $exc) {
      ob_start();
      echo "Transitioning error";
      var_dump($exc);
      $err = ob_get_clean();

      echo $err;
      error_log($err);
      exit;
    }
    finally {
      release_lock(Transition::$pdo, $lock_name);
    }
  }, 1000);

