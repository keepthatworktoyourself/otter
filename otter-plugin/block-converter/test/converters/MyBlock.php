<?php
  define_converters('MyBlock', function($b) {
    return [
      '__type' => 'Header',
      'heading' => $b['text'],
    ];
  });

