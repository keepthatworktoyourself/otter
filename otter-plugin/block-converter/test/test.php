<?php
  ini_set('assert.exception', 1);

  passthru('docker exec -i mysql mysql -uroot -proot -e \'create database if not exists temp__block_converter\'');
  passthru('docker exec -i mysql mysql -uroot -proot temp__block_converter < db/create.sql');

  $input_data = [
    [
      '__type' => 'MyBlock',
      'text' => 'Hello there',
    ],
    [
      '__type' => 'Muffins',
      'number_of_muffins' => 7,
      'recipe' => [
        '__type' => 'Recipe',
        'ingredients' => [ 'lemon', 'muffin dough' ],
        'instructions' => 'Put all in mouth',
      ],
    ],
    [
      '__type' => 'ZooInventory',
      'animals' => [
        [
          '__type' => 'Penguin',
          'name' => 'Herbert Skinnyflippers',
        ],
        [
          '__type' => 'Weasel',
          'name' => 'Gerontius McMustelid'
        ],
      ],
    ],
  ];

  $expected = [
    [
      '__type' => 'Header',
      'heading' => 'Hello there',
    ],
    [
      '__type' => 'McMuffins',
      'count' => 7,
      'recipe' => [
        '__type' => 'Recipe',
        'the_ingredients' => [ 'lemon', 'muffin dough' ],
        'the_instructions' => 'Put all in mouth',
      ],
    ],
    [
      '__type' => 'AnimalList',
      'animals' => [
        [
          '__type' => 'Animal',
          'species' => 'penguin',
          'name' => 'Herbert Skinnyflippers',
        ],
        [
          '__type' => 'Animal',
          'species' => 'weasel',
          'name' => 'Gerontius McMustelid'
        ],
      ],
    ],
  ];

  $pdo = new PDO('mysql:dbname=temp__block_converter;host=127.0.0.1', 'block_converter', 'block_converter');
  $st = $pdo->prepare('insert into data_before (post_id, data) values (?, ?)');
  $result = $st->execute([99, serialize($input_data)]);

  passthru('php ../run.php');


  // Check results
  // ---------------------------------

  $st = $pdo->prepare('select * from data_after');

  $result = $st->execute();
  assert($result === true);

  $data = $st->fetchAll(PDO::FETCH_ASSOC);
  $actual = unserialize($data[0]['data']);
  assert(count($data) === 1);
  assert($data[0]['post_id'] === '99');
  assert($actual === $expected);

  echo "Succeeded.\n";


  // Cleanup
  // ---------------------------------

  passthru('docker exec -i mysql mysql -uroot -proot -e \'drop database temp__block_converter\'');

