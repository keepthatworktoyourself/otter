<?php
  define_converter('ZooInventory', function($b) {
    return [
      '__type' => 'AnimalList',
      'animals' => $b->animals,
    ];
  });

