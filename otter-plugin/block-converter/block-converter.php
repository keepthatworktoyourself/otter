<?php
  namespace Otter;

  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  require_once('helpers.php');
  require_once('convert.php');


  class Transition {
    // config
    // ---------------------------------
    // Set these in the transition's setup.php file

    static $load;       // ($pdo) -> [ row, ... ]  rows must have post_id and data
    static $meta_key;   // the key to save/update otter data in wp_postmeta
    static $is_block;   // ($block) -> bool
    static $cleanup;    // ($pdo) -> null


    // define_converter
    // ---------------------------------
    // Use to register block converters

    static function define_converter($type, $func) {
      self::$converters[$type] = $func;
    }


    // reset()
    // ---------------------------------
    // Called automatically before each transition
    // (As multiple transitions may run during a single session)

    static function reset() {
      self::$load       = null;
      self::$meta_key   = null;
      self::$is_block   = null;
      self::$cleanup    = null;
      self::$converters = [ ];
    }

    static $converters;
    static $pdo;
  }


  // run_transition()
  // ---------------------------------
  // config directory expects:
  // - setup.php - set \Otter\Transition::$load to anonymous function: ($pdo) -> rows array
  //                 - each row must have keys: post_id
  //                                            data
  //                 - if no $load function is set, no autoconversion will run but other scripts will
  //
  //             - set \Otter\Transition::$is_block to anonymous function: ($block) -> bool
  //                 - this is used in recursive search to identify blocks for conversion

  function run_transition($directory) {
    Transition::reset();

    if (!file_exists("$directory/setup.php")) {
      return false;
    }

    // Load config
    require("$directory/setup.php");

    // Load converters
    if (is_dir("$directory/converters")) {
      $converter_files = \Otter\files_with_extension("$directory/converters", 'php');
      foreach ($converter_files as $file) {
        require("$directory/converters/$file");
      }
    }

    // Load data
    if (Transition::$load) {
      $rows = (Transition::$load)(Transition::$pdo);
    }

    // Convert
    if ($rows) {
      $rows__converted = array_map(function($row) {
        return array_merge($row, ['data' => convert($row['data'], Transition::$converters, $row)]);
      }, $rows);
    }

    // Save
    if ($rows__converted) {
      if (!Transition::$meta_key) {
        throw new Exception('Data has been loaded & converted, but no $meta_key was set.');
      }
      foreach ($rows__converted as $row) {
        $meta_key = Transition::$meta_key;

        if (is_array($meta_key)) {
          $post_type = $row['post_type'] ?? null;
          if (!$post_type) {
            throw new Exception('No post_type was found in row: this must be supplied when using an array $meta_key');
          }
          $meta_key = $meta_key[$post_type] ?? null;
          if (!$meta_key) {
            throw new Exception("No meta key was found in the row for post_type '{$row['post_type']}'");
          }
        }

        \Otter\save($row['post_id'], $meta_key, $row['data'] ?? [ ]);
      }
    }

    // Cleanup
    if (Transition::$cleanup) {
      (Transition::$cleanup)(Transition::$pdo);
    }
  }

