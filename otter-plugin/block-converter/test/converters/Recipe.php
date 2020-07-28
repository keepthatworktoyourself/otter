<?php
  define_converters('Recipe', function($b) {
    return [
      '__type' => 'Recipe',
      'the_ingredients' => $b['ingredients'],
      'the_instructions' => $b['instructions'],
    ];
  });

