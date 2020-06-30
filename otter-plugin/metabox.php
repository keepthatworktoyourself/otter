<?php
  $data = \Iceberg\load($post->ID);
  $data = \Iceberg\serialize($data);
  $iframe_url = '../wp-content/plugins/iceberg-wp/editor/dist/index.html?' .
    "post_type={$post->post_type}";
?>

<input type="text" name="iceberg-data" id="iceberg-data" style="display: none;" />

<iframe class="iceberg-container" style="display: block; width: 100%;"
        src="<?= $iframe_url ?>"
        data-iceberg="<?= base64_encode($data) ?>">
</iframe>

<style>
  #iceberg-editor-metabox .inside {
    margin: 0;
    padding: 0;
  }

  #postdivrich {
    display: none;
  }
</style>

<script>
  (function() {
    const iframe = document.querySelector('.iceberg-container');
    const input = document.querySelector('#iceberg-data');

    // Update height
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const is_height_msg = ev.data && ev.data['set-height'];
      if (is_height_msg) {
        iframe.style.height = ev.data['set-height'];
      }
    });


    // Update content data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const is_iceberg_data_msg = ev.data && ev.data['iceberg-data'];
      if (is_iceberg_data_msg) {
        input.value = JSON.stringify(ev.data['iceberg-data']);
      }
    });


    // Provide initial data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const is_iceberg_get_data_msg = ev.data['iceberg-initial'];
      if (is_iceberg_get_data_msg) {
        const data = JSON.parse(atob(
          iframe.getAttribute('data-iceberg')
        ));

        iframe.contentWindow.postMessage({
          'iceberg-initial': data,
        });
      }
    });
  })();
</script>

