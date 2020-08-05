<?php
  //
  // block-converter/run.php
  //
  // - edit config.txt
  // - run `php /path/to/run.php` from a directory containing a folder of 'converters'
  //   and a config.txt file
  // - see test/config.txt and test/converters
  //

  require_once('convert.php');


  // Dynamically create stdclass models during
  // unserialize
  // ---------------------------------

  function unserialize_helper($class) {
    if (!class_exists($class)) {
      eval("class $class extends stdClass { }");
    }
  }
  ini_set('unserialize_callback_func', 'unserialize_helper');


  // Get config
  // ---------------------------------

  $config = @file_get_contents('./config.txt');
  if (!is_string($config)) {
    exit("config.txt not found\n");
  }

  $config = explode("\n", $config);
  $config = array_reduce($config, function($carry, $item) {
    $item = explode('=', $item);

    if (is_array($item) && count($item) > 1) {
      if (count($item) > 2) {
        $item[1] = implode('=', array_slice($item, 1));
      }
      $carry[$item[0]] = $item[1];
    }
    return $carry;
  }, [ ]);


  // Connect
  // ---------------------------------

  try {
    $pdo = new PDO(
      "mysql:dbname={$config['db']};host={$config['dbhost']}",
      $config['dbuser'],
      $config['dbpassword'],
      [ PDO::MYSQL_ATTR_FOUND_ROWS => true ]
    );
  }
  catch (PDOException $exc) {
    exit("error connecting to database\n");
  }


  // Load data
  // ---------------------------------

  $st = $pdo->prepare($config['select_query']);
  $r = $st->execute();
  if (!$r) {
    exit("error running select_query as defined in config.txt\n");
  }
  $data = $st->fetchAll(PDO::FETCH_ASSOC);


  // Load converters
  // ---------------------------------

  $converters = [ ];
  $converter_files = array_diff(scandir('converters'), ['.', '..', '.DS_Store']);

  function define_converter($type, $f) {
    global $converters;
    $converters[$type] = $f;
  }

  foreach ($converter_files as $f) {
    require("converters/$f");
  }


  // Convert
  // ---------------------------------

  $data__converted = array_map(function($row) use ($converters) {
    $item_data = unserialize($row['data']);
    $row['data'] = convert($item_data, $converters);
    return $row;
  }, $data);


  // Save
  // ---------------------------------

  $st__update = $pdo->prepare($config['update_query']);
  $st__insert = $pdo->prepare($config['insert_query']);

  function save_warning_if_failure($result, $row, $type) {
    if (!$result) {
      echo "WARNING: failed to $type row ";
      var_dump($row);
    }
  }

  foreach ($data__converted as $row) {
    $params = [
      $row['post_id'],
      serialize($row['data'])
    ];

    $r = $st__update->execute(array_reverse($params));
    save_warning_if_failure($r, $row, 'update');

    if ($r && $st__update->rowCount() === 0) {
      $r = $st__insert->execute($params);
      save_warning_if_failure($r, $row, 'insert');
    }
  }

