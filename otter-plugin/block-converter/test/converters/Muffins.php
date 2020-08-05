<?php
  define_converter('Muffins', function($b) {
    return [
      '__type' => 'McMuffins',
      'count' => $b->number_of_muffins,
      'recipe' => $b->recipe,
    ];
  });

