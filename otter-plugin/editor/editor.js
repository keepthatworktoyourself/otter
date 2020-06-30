//
// editor/editor.js - loads the user-created Otter bundle
//

(function() {
  window.addEventListener('message', function(ev) {
    const js  = ev.data && ev.data['otter--set-js-bundle'];
    const css = ev.data && ev.data['otter--set-css-bundle'];

    if (js) {
      const s = document.createElement('script');
      s.src = ev.data['otter--set-js-bundle'];
      document.body.appendChild(s);
    }
    else if (css) {
      const l = document.createElement('link');
      l.rel = "stylesheet";
      l.href = ev.data['otter--set-css-bundle'];
      document.head.appendChild(l);
    }
  });

  window.parent.postMessage({ 'otter--get-js-bundle': true });
  window.parent.postMessage({ 'otter--get-css-bundle': true });
})();

