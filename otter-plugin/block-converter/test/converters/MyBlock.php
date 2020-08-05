<?php
  define_converter('MyBlock', function($b) {
    return [
      '__type' => 'Header',
      'heading' => $b->text,
    ];
  });

