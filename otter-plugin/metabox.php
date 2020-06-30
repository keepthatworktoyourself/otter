<?php
  $data = \Otter\load($post->ID);
  $data = \Otter\serialize($data ? $data : []);

  $js_bundle = \Otter\otter_for_post_type($post->post_type);
  $css_bundle = \Otter\css_bundle();

  $iframe_url = '../wp-content/plugins/otter-plugin/editor/editor.html';
?>

<input type="text" name="otter-data" id="otter-data" style="display: none;" />

<iframe class="otter-container" style="display: block; width: 100%;"
        src="<?= $iframe_url ?>"
        data-otter-initial-data="<?= base64_encode($data) ?>"
        data-otter-js-bundle="<?= base64_encode($js_bundle) ?>"
        data-otter-css-bundle="<?= base64_encode($css_bundle) ?>">
</iframe>

<style>
  #otter-editor-metabox .inside {
    margin: 0;
    padding: 0;
  }

  #postdivrich {
    display: none;
  }
</style>

<script>
  (function() {
    const iframe = document.querySelector('.otter-container');
    const input = document.querySelector('#otter-data');


    // Provide user-bundled otter file
    // -------------------------------
    // - Unlike the other messages, this comes from index.js, which
    //   discovers the otter js bundle to load

    window.addEventListener('message', function(ev) {
      const js  = ev.data && ev.data['otter--get-js-bundle'];
      const css = ev.data && ev.data['otter--get-css-bundle'];

      if (js) {
        const bundle_file = atob(iframe.getAttribute('data-otter-js-bundle'));
        iframe.contentWindow.postMessage({
          'otter--set-js-bundle': bundle_file,
        });
      }
      else if (css) {
        const bundle_file = atob(iframe.getAttribute('data-otter-css-bundle'));
        iframe.contentWindow.postMessage({
          'otter--set-css-bundle': bundle_file,
        });
      }
    });


    // Update height
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['otter--set-height'];
      if (proceed) {
        iframe.style.height = ev.data['otter--set-height'];
      }
    });


    // Update content data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['otter--set-data'];
      if (proceed) {
        input.value = JSON.stringify(ev.data['otter--set-data']);
      }
    });


    // Provide initial data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data['otter--get-initial-data'];
      if (proceed) {
        const data = JSON.parse(atob(
          iframe.getAttribute('data-otter-initial-data')
        ));

        iframe.contentWindow.postMessage({
          'otter--set-initial-data': data,
        });
      }
    });
  })();
</script>

