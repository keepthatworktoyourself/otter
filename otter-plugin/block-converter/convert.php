<?php
  function is_item($obj) {
    return gettype($obj) === 'object';
  }
  function is_item_array($arr) {
    return is_array($arr) && isset($arr['__type']);
  }

  // convert()
  // ---------------------------------
  // - recursively convert data using a map of converters:
  //    [ 'BlockType' => function($block) -> $converted_block ]

  function convert($data, $converters) {
    if (!(is_item($data) || is_array($data))) {
      return $data;
    }

    foreach ($data as $k => $v) {
      if (is_array($data)) {
        $data[$k] = convert($data[$k], $converters);
      }
      else {
        $data->$k = convert($data->$k, $converters);
      }
    }

    if (is_item($data)) {
      $item_type = $data->__type;
      if (isset($converters[$item_type])) {
        $data = $converters[$item_type]($data);
      }
    }

    if (is_item_array($data)) {
      foreach ($data as $k => $v) {
        if ($v === null) {
          unset($data[$k]);
        }
      }
    }

    return $data;
  }

