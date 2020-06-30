<?php
  $data = \Iceberg\load($post->ID);
  $data = \Iceberg\serialize($data ? $data : []);

  $js_bundle = \Iceberg\iceberg_for_post_type($post->post_type);
  $css_bundle = \Iceberg\css_bundle();

  $iframe_url = '../wp-content/plugins/iceberg-plugin/editor/editor.html';
?>

<input type="text" name="iceberg-data" id="iceberg-data" style="display: none;" />

<iframe class="iceberg-container" style="display: block; width: 100%;"
        src="<?= $iframe_url ?>"
        data-iceberg-initial-data="<?= base64_encode($data) ?>"
        data-iceberg-js-bundle="<?= base64_encode($js_bundle) ?>"
        data-iceberg-css-bundle="<?= base64_encode($css_bundle) ?>">
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


    // Provide user-bundled iceberg file
    // -------------------------------
    // - Unlike the other messages, this comes from index.js, which
    //   discovers the iceberg js bundle to load

    window.addEventListener('message', function(ev) {
      const js  = ev.data && ev.data['iceberg--get-js-bundle'];
      const css = ev.data && ev.data['iceberg--get-css-bundle'];

      if (js) {
        const bundle_file = atob(iframe.getAttribute('data-iceberg-js-bundle'));
        iframe.contentWindow.postMessage({
          'iceberg--set-js-bundle': bundle_file,
        });
      }
      else if (css) {
        const bundle_file = atob(iframe.getAttribute('data-iceberg-css-bundle'));
        iframe.contentWindow.postMessage({
          'iceberg--set-css-bundle': bundle_file,
        });
      }
    });


    // Update height
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['iceberg--set-height'];
      if (proceed) {
        iframe.style.height = ev.data['iceberg--set-height'];
      }
    });


    // Update content data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['iceberg--set-data'];
      if (proceed) {
        input.value = JSON.stringify(ev.data['iceberg--set-data']);
      }
    });


    // Provide initial data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data['iceberg--get-initial-data'];
      if (proceed) {
        const data = JSON.parse(atob(
          iframe.getAttribute('data-iceberg-initial-data')
        ));

        iframe.contentWindow.postMessage({
          'iceberg--set-initial-data': data,
        });
      }
    });
  })();
</script>

