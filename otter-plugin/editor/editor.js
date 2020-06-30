//
// editor/editor.js - loads the user-created Iceberg bundle
//

(function() {
  window.addEventListener('message', function(ev) {
    const js  = ev.data && ev.data['iceberg--set-js-bundle'];
    const css = ev.data && ev.data['iceberg--set-css-bundle'];

    if (js) {
      const s = document.createElement('script');
      s.src = ev.data['iceberg--set-js-bundle'];
      document.body.appendChild(s);
    }
    else if (css) {
      const l = document.createElement('link');
      l.rel = "stylesheet";
      l.href = ev.data['iceberg--set-css-bundle'];
      document.head.appendChild(l);
    }
  });

  window.parent.postMessage({ 'iceberg--get-js-bundle': true });
  window.parent.postMessage({ 'iceberg--get-css-bundle': true });
})();

