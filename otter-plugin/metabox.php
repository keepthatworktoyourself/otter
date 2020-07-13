<?php
  $data = \Otter\load($post->ID);

  $js_bundle = \Otter\otter_for_post_type($post->post_type);
  $css_bundle = \Otter\css_bundle();

  $iframe_url = '../wp-content/plugins/otter-plugin/editor/editor.html';
?>

<input type="text" name="otter-data" id="otter-data" style="display: none;" />

<iframe class="otter-container" style="display: block; width: 100%;"
        src="<?= $iframe_url ?>"
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
    const initial_data = <?= json_encode($data, JSON_UNESCAPED_UNICODE) ?>;
    const dynamic_data = <?= json_encode(\Otter\dynamic_data(), JSON_UNESCAPED_UNICODE) ?>;


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
        iframe.contentWindow.postMessage({
          'otter--set-initial-data': initial_data,
        });
      }
    });


    // Provide dynamic data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data['otter--get-dynamic-data'];
      if (proceed) {
        const item_name = ev.data['otter--get-dynamic-data'];
        iframe.contentWindow.postMessage({
          'otter--set-dynamic-data': {
            name: item_name,
            value: dynamic_data[item_name],
          },
        });
      }
    })


    // Media button
    // -------------------------------

    const media_handler = {
      frame: null,

      open: function(allowed_types) {
        const mimes = {
          jpg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          mov: 'video/quicktime',
          mp4: 'video/mp4',
          svg: 'image/svg+xml',
          pdf: 'application/pdf',
          csv: 'text/csv',
        };

        const allowed_types__mime =
          allowed_types.map(t => mimes[t])
          .filter(t => t);

        const modal_opts = {
          title: 'Pick a media item (' + allowed_types.join(', ') + ')',
          // multiple: false,
          library: {
            type: allowed_types__mime.join(', '),
          },
        };

        media_handler.frame = wp.media(modal_opts);
        media_handler.frame.on('select', media_handler.select);
        media_handler.frame.open();
      },

      select: function() {
        const item = media_handler
          .frame
          .state()
          .get('selection').first().toJSON();

        media_handler.send({
          id: item.id,
          url: item.url,
          thumbnail:
            (item.sizes && item.sizes.thumbnail && item.sizes.thumbnail.url) ||
            (item.icon),
        });
      },

      send: function(item) {
        iframe.contentWindow.postMessage({
          'otter--set-wp-media-item': item,
        });
      },
    };

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['otter--get-wp-media-item'];
      if (proceed) {
        const media_types = ev.data['otter--get-wp-media-item'];
        media_handler.open(media_types);
      }
    });
  })();
</script>

