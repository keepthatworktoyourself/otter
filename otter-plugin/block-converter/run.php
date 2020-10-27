<?php
  //
  // block-converter/run.php
  //
  // - edit config.txt
  // - run `php /path/to/run.php` from a directory containing a folder of 'converters'
  //   and a config.txt file
  // - see test/config.txt for config and test/converters for writing converters
  //

  require_once('helpers.php');


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


  // Load
  // ---------------------------------

  require_once($config['wp_config']);

  if ($config['function_overrides']) {
    require($config['function_overrides']);
  }


  // Connect
  // ---------------------------------

  try {
    $db   = DB_NAME;
    $host = DB_HOST;
    $user = DB_USER;
    $pwd  = DB_PASSWORD;

    $pdo = new PDO(
      "mysql:dbname=$db;host=$host;charset=utf8",
      $user,
      $pwd,
      [ PDO::MYSQL_ATTR_FOUND_ROWS => true ]
    );
    if ($config['exception_on_db_error'] === 'true') {
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    $pdo->exec('set names utf8mb4 collate utf8mb4_unicode_ci');
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

  // Optionally pass data through load function
  if ($config['load_function']) {
    $data = array_map(function($row) use ($config) {
      $load = $config['load_function'];
      $row['data'] = $load($row['post_id']);
      return $row;
    }, $data);
  }


  // Load converters
  // ---------------------------------

  require_once('convert.php');

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
    $row['data'] = convert($row['data'], $converters);
    return $row;
  }, $data);


  // Save
  // ---------------------------------

  $st__update = $pdo->prepare($config['update_query']);
  $st__insert = $pdo->prepare($config['insert_query']);

  function save_warning_if_failure($st, $result, $params, $type) {
    if (!$result) {
      echo "WARNING: failed to $type row, post_id ";
      var_dump($row['post_id']);
      var_dump($st->errorInfo());
      var_dump($params);
    }
  }

  foreach ($data__converted as $row) {
    $params = [
      $row['post_id'],
      serialize($row['data'])
    ];

    $r = $st__update->execute(array_reverse($params));
    save_warning_if_failure($st, $r, $row, 'update');

    if ($r && $st__update->rowCount() === 0) {
      $r = $st__insert->execute($params);
      save_warning_if_failure($st, $r, $params, 'insert');
    }
  }

