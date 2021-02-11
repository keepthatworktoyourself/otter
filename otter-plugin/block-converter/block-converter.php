<?php
  namespace Otter;

  require_once('helpers.php');
  require_once('convert.php');


  class Transition {
    static $load;
    static $meta_key;
    static $is_block;

    static $converters;
    static $pdo;

    static function reset() {
      self::$load       = null;
      self::$meta_key   = null;
      self::$is_block   = null;
      self::$converters = [ ];
    }

    static function define_converter($type, $func) {
      self::$converters[$type] = $func;
    }
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

    // Load setup
    require("$directory/setup.php");

    // Load converters
    $converter_files = \Otter\files_with_extension("$directory/converters", 'php');
    foreach ($converter_files as $file) {
      require("$directory/converters/$file");
    }

    if (Transition::$load) {
      $rows = (Transition::$load)(Transition::$pdo);
    }

    if ($rows) {
      $rows__converted = array_map(function($row) {
        return array_merge($row, ['data' => convert($row['data'], Transition::$converters)]);
      }, $rows);
    }

    if ($rows__converted) {
      foreach ($rows__converted as $row) {
        \Otter\save($row['post_id'], Transition::$meta_key, $row['data'] ?? [ ]);
      }
    }
  }

