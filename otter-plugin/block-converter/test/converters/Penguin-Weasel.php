<?php
  function convert_animals($b) {
    return [
      '__type' => 'Animal',
      'species' => strtolower($b['__type']),
      'name' => $b['name'],
    ];
  }

  define_converters('Penguin', 'convert_animals');
  define_converters('Weasel', 'convert_animals');

