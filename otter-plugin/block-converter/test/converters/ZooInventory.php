<?php
  define_converters('ZooInventory', function($b) {
    return [
      '__type' => 'AnimalList',
      'animals' => $b['animals'],
    ];
  });

