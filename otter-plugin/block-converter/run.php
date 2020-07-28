<?php
  //
  // block-converter/run.php
  //
  // - edit config.txt
  // - run `php /path/to/run.php` from a directory containing a folder of 'converters' and a config.txt file
  // - see test/config.txt and test/converters
  //

  require_once('convert.php');


  // Get config
  // ---------------------------------

  $config = @file_get_contents('./config.txt');
  if (!is_string($config)) {
    exit('config.txt not found');
  }

  $config = explode("\n", $config);
  $config = array_reduce($config, function($carry, $item) {
    $item = explode('=', $item);
    if (is_array($item) && count($item) === 2) {
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
      $config['dbpassword']
    );
  }
  catch (PDOException $exc) {
    exit('error connecting to database');
  }


  // Load data
  // ---------------------------------

  $st = $pdo->prepare($config['select_query']);
  $r = $st->execute();
  if (!$r) {
    exit('error running select_query as defined in config.txt');
  }
  $data = $st->fetchAll(PDO::FETCH_ASSOC);


  // Load converters
  // ---------------------------------

  $converters = [ ];
  $converters_files = array_diff(scandir('converters'), ['.', '..']);

  function define_converters($type, $f) {
    global $converters;
    $converters[$type] = $f;
  }

  foreach ($converters_files as $f) {
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
  $st = $pdo->prepare($config['insert_query']);
  foreach ($data__converted as $row) {
    $r = $st->execute([
      $row['post_id'],
      serialize($row['data'])
    ]);

    if (!$r) {
      echo 'WARNING: failed to insert row ';
      var_dump($row);
    }
  }

