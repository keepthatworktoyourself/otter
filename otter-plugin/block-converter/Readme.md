# Otter / block-converter

Automatically convert old blocks to new blocks.


## Running

Make a folder containing:

- A `config.txt` file
- A folder named `converters` containing your converter functions

See [test](test)/`config.txt` and `converters/`. From the folder you created, run `php /path/to/run.php`.


## Sample converter

*Converters* are used to convert data. `block-converter` automatically and recursively applies these to all posts.

Example of a converter to replace `Image` blocks with new `Media` blocks:

```php
define_converter('Image', function($b) {
  return [
    '__type' => 'Media',
    'image' => $b['image_url'],
  ];
});
```

