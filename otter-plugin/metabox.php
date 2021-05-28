<?php
  if (!defined('ABSPATH')) {
    exit('Invalid request.');
  }

  $data = \Otter\load($post->ID, $editor_info['meta_key']);

  $css_bundle = \Otter\set_css_bundle_path();
  $input_name = "otter-data--{$editor_info['meta_key']}";
  $iframe_id = "otter-container--{$editor_info['meta_key']}";
?>

<input type="text" name="<?php echo $input_name ?>" style="display: none;" />

<iframe id="<?php echo $iframe_id ?>"
        style="display: block; width: 100%;"></iframe>

<style>
  #otter-editor-metabox--<?php echo $editor_info['meta_key'] ?> .inside {
    margin: 0;
    padding: 0;
  }

  #postdivrich {
    display: none;
  }
</style>

<script>
  (function() {
    const iframe = document.getElementById('<?php echo $iframe_id ?>');
    const input = document.querySelector('input[name="<?php echo $input_name ?>"]');
    const initial_data = <?php echo json_encode($data, JSON_UNESCAPED_UNICODE) ?>;
    const dynamic_data = <?php echo json_encode(\Otter\dynamic_data(), JSON_UNESCAPED_UNICODE) ?>;
    let times_updated = 0;

    set_input_value(initial_data);


    // Initialize iframe
    // -------------------------------

    function iframe_init() {
      const iframe_doc = iframe.contentWindow.document;
      iframe_doc.innerHTML = '<!doctype html><html></html>';

      const link = iframe_doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = '<?php echo $css_bundle ?>';

      const div = iframe_doc.createElement('div');
      div.className = 'otter-container';

      const script = iframe_doc.createElement('script');
      script.src = '<?php echo $editor_info['bundle_path'] ?>';

      iframe_doc.head.appendChild(link);
      iframe_doc.body.appendChild(div);
      iframe_doc.body.appendChild(script);
    }
    iframe_init();


    // Update height
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['otter--set-height'] && ev.source === iframe.contentWindow;
      if (proceed) {
        iframe.style.height = ev.data['otter--set-height'];
      }
    });


    // Update window info for block-picker
    // -------------------------------

    function send_window_info() {
      const scr = window.scrollY;
      const y = iframe.getBoundingClientRect().y + scr;

      iframe.contentWindow.postMessage({
        'otter--set-iframe-container-info': {
          y:      scr > y ? scr - y + 25: 0,
          height: window.innerHeight - 60,
        }
      });
    }
    function limit(f, t) {
      return function() {
        clearTimeout(limit.timeout);
        limit.timeout = setTimeout(f, t);
      }
    }
    document.addEventListener('DOMContentLoaded', send_window_info);
    window.addEventListener('scroll', limit(send_window_info, 500));
    window.addEventListener('resize', limit(send_window_info, 500));


    // Warn on navigation
    // -------------------------------

    function bind_navigation_warning() {
      function is_submitting() {
        return document.querySelector('#publishing-action .spinner').classList.contains('is-active');
      }

      window.addEventListener('beforeunload', function(ev) {
        if (is_submitting()) {
          return null;
        }

        const msg =
          "Sure you want to navigate away?\n" +
          "It looks like you've edited things on the page!";

        (ev || window.event).returnValue = msg;
        return msg;
          // NB the message contents is ignored in modern browsers
      });
    }


    // Content update
    // -------------------------------

    function set_input_value(data) {
      input.value = JSON.stringify(data);

      if (times_updated > 0) {
        bind_navigation_warning();
      }
      times_updated += 1;
    }

    window.addEventListener('message', function(ev) {
      const proceed = ev.data && ev.data['otter--set-data'] && ev.source === iframe.contentWindow;
      if (proceed) {
        set_input_value(ev.data['otter--set-data']);
      }
    });


    // Provide initial data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data['otter--get-initial-data'] && ev.source === iframe.contentWindow;
      if (proceed) {
        iframe.contentWindow.postMessage({
          'otter--set-initial-data': initial_data,
        });
      }
    });


    // Provide dynamic data
    // -------------------------------

    window.addEventListener('message', function(ev) {
      const proceed = ev.data['otter--get-dynamic-data'] && ev.source === iframe.contentWindow;
      if (proceed) {
        const item_name = ev.data['otter--get-dynamic-data'];
        iframe.contentWindow.postMessage({
          'otter--set-dynamic-data': {
            name: item_name,
            value: dynamic_data[item_name],
          },
        });
      }
    });


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
      const proceed = ev.data && ev.data['otter--get-wp-media-item'] && ev.source === iframe.contentWindow;
      if (proceed) {
        const media_types = ev.data['otter--get-wp-media-item'];
        media_handler.open(media_types);
      }
    });
  })();
</script>

