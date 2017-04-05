(function (win, doc) {
  var IS_PROD = !(window.location.port && (window.location.hostname.split('.').length === 4 || window.location.hostname === 'localhost'));
  console.error(IS_PROD);
  var ORIGIN_NO_PORT = window.location.protocol + '//' + window.location.hostname;
  var webvrAgentScript = doc.querySelector('script[src*="agent"][src*="/client.js"]');
  var webvrAgentScriptSrcLocal = ORIGIN_NO_PORT + ':4040/client.js';
  var webvrAgentScriptSrcProd = 'https://agent.webvr.rocks/client.js';
  var webvrAgentScriptSrc = IS_PROD ? webvrAgentScriptSrcProd : webvrAgentScriptSrcLocal;

  if (IS_PROD) {
    injectProdScriptIfMissing();
  } else {
    var req = new Image();
    req.addEventListener('load', function () {
      if (webvrAgentScript) {
        if (!IS_PROD) {
          webvrAgentScript.abort = true;
          webvrAgentScript.src = webvrAgentScript.src.replace(/(.+)client.js/, ORIGIN_NO_PORT + ':4040/client.js');
        }
      } else {
        injectProdScriptIfMissing();
      }
    });
    req.addEventListener('error', function () {
      injectProdScriptIfMissing();
    });
    req.src = ORIGIN_NO_PORT + ':4040/favicon.ico';
  }

  function injectProdScriptIfMissing () {
    if (!webvrAgentScript) {
      webvrAgentScript = doc.createElement('script');
      webvrAgentScript.src = webvrAgentScriptSrc;
      webvrAgentScript.async = webvrAgentScript.defer = true;
      doc.head.appendChild(webvrAgentScript);
    }
  }
})(window, document);
