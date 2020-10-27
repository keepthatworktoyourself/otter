<?php
  if (!is_callable('is_item')) {
    function is_item($obj) {
      return gettype($obj) === 'object';
    }
  }

  if (!is_callable('is_converted_item')) {
    function is_converted_item($arr) {
      return is_array($arr) && isset($arr['__type']);
    }
  }

  function is_obj($x) {
    return gettype($x) === 'object';
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
      if (is_array($data) && !is_item($data)) {
        $data[$k] = convert($data[$k], $converters);
      }
      else {
        $value = is_obj($data) ? $data->$k : $data[$k];
        $converted = convert($value, $converters);
        if (is_obj($data)) {
          $data->$k = $converted;
        }
        else {
          $data[$k] = $converted;
        }
      }
    }

    if (is_item($data)) {
      $item_type = is_obj($data) ? $data->__type : $data['__type'];
      if (isset($converters[$item_type])) {
        $data = $converters[$item_type]($data);
      }
    }

    if (is_converted_item($data)) {
      foreach ($data as $k => $v) {
        if ($v === null) {
          unset($data[$k]);
        }
      }
    }

    return $data;
  }

