<?php
  function convert_animals($b) {
    return [
      '__type' => 'Animal',
      'species' => strtolower($b->__type),
      'name' => $b->name,
    ];
  }

  define_converter('Penguin', 'convert_animals');
  define_converter('Weasel', 'convert_animals');

