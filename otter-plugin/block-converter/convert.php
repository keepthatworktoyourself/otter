<?php
  namespace Otter;

  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  // convert()
  // ---------------------------------
  // - recursively convert data using a map of converters:
  //    [ 'BlockType' => function($block) -> $converted_block ]

  function convert($data, $converters, $row) {
    $is_block = Transition::$is_block;

    if (!($is_block($data) || is_array($data))) {
      return $data;
    }

    foreach ($data as $k => $v) {
      if (is_array($data) && !$is_block($data)) {
        $data[$k] = convert($data[$k], $converters, $row);
      }
      else {
        $value = is_obj($data) ? $data->$k : $data[$k];
        $converted = convert($value, $converters, $row);
        if (is_obj($data)) {
          $data->$k = $converted;
        }
        else {
          $data[$k] = $converted;
        }
      }
    }

    if ($is_block($data)) {
      $item_type = is_obj($data) ? $data->__type : $data['__type'];
      if (isset($converters[$item_type])) {
        $data = $converters[$item_type]($data, $row);
      }
    }

    return $data;
  }

