<?php
  //
  // compare.php - compare all files in DIR1 to all those in DIR2
  //

  $dir1 = getenv('DIR1');
  $dir2 = getenv('DIR2');

  if (!$dir1 || !$dir2) {
    exit("set DIR1 and DIR2 env variables to compare directories\n");
  }

  $files1 = array_values(array_diff(scandir($dir1), ['.', '..', '.DS_Store']));
  $files2 = array_values(array_diff(scandir($dir2), ['.', '..', '.DS_Store']));

  if (count($files1) === 0) {
    echo "Error: no files to compare\n";
    exit(1);
  }

  if (count($files1) !== count($files2)) {
    echo "Fail: number of files differs\n";
    exit(1);
  }

  if ($files1 !== $files2) {
    echo "Fail: file names differ\n";
    var_dump(array_diff($files1, $files2));
    exit(1);
  }

  $failures = array_reduce($files1, function($carry, $fn) use ($dir1, $dir2) {
    $s1 = file_get_contents("$dir1/$fn");
    $s2 = file_get_contents("$dir2/$fn");

    if ($s1 !== $s2) {
      $carry []= $fn;
    }

    return $carry;
  }, [ ]);
  $n_failures = count($failures);

  if ($n_failures > 0) {
    echo "Fail: $n_failures failures:\n";
    echo "- ", implode($failures, "\n- "), "\n";
    exit(1);
  }

  echo "Pass\n";

