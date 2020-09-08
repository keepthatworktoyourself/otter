<?php
  define_converter('Recipe', function($b) {
    return [
      '__type' => 'Recipe',
      'the_ingredients' => $b->ingredients,
      'the_instructions' => $b->instructions,
    ];
  });

