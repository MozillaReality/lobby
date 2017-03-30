var IS_DEV = window.location.port && (window.location.hostname.split('.').length === 4 || window.location.hostname === 'localhost');
var ORIGIN_NO_PORT = window.location.protocol + '//' + window.location.hostname;

(function (win, doc) {
  var webvrAgentScript = doc.querySelector('script[src*="agent"][src*="/client.js"]');
  var webvrAgentScriptSrcLocal = ORIGIN_NO_PORT + ':4040/client.js';
  var webvrAgentScriptSrcProd = 'https://agent.webvr.rocks/client.js';
  var webvrAgentScriptSrc = IS_DEV ? webvrAgentScriptSrcLocal : webvrAgentScriptSrcProd;

  if (IS_DEV) {
    var req = new Image();
    req.addEventListener('load', function () {
      if (webvrAgentScript) {
        if (IS_DEV) {
          webvrAgentScript.abort = true;
          webvrAgentScript.src = webvrAgentScript.src.replace(/(.+)client.js/, ORIGIN_NO_PORT + ':4040/client.js');
        }
      } else {
        webvrAgentScript = doc.createElement('script');
        webvrAgentScript.src = webvrAgentScriptSrc;
        webvrAgentScript.async = webvrAgentScript.defer = true;
        doc.head.appendChild(webvrAgentScript);
      }
    });
    req.addEventListener('error', function (err) {
      injectProdScriptIfMissing();
    });
    req.src = ORIGIN_NO_PORT + ':4040/favicon.ico';
  } else {
    injectProdScriptIfMissing();
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

var sites = [
  {
    name: 'Shadows and Fog',
    // start_url: 'https://aframe.io/aframe/examples/showcase/spheres-and-fog/'
    start_url: 'fog.html',
    is_showcase: true
  },
  {
    name: 'Puzzle Rain',
    start_url: 'https://mozvr.com/puzzle-rain/?mode=normal&src=moonrise',
    // processed_gltf_icon: 'https://mozvr.com/puzzle-rain/models/gltf/puzzle-rain.gltf'
    processed_gltf_icon: 'models/puzzle-rain/puzzle-rain.gltf',
    is_showcase: true
  },
  {
    name: 'A-Painter',
    start_url: 'https://aframe.io/a-painter/',
    is_showcase: true
  },
  {
    name: 'A-Blast',
    start_url: 'https://aframe.io/a-blast/',
    is_recent: true
  },
  {
    name: 'Sketchfab',
    start_url: 'https://sketchfab.com/vr',
    is_recent: true
  },
  {
    name: 'Finding Love',
    start_url: 'https://findinglove.activetheory.net/',
    is_recent: true
  }
];

function transformSites (sites, replacement) {
  if (replacement && replacement.length === 2) {
    sites.forEach(function (site, idx) {
      ['start_url', 'processed_gltf_icon'].forEach(function (key) {
        if (!(key in site)) {
          return;
        }
        sites[idx][key] = site[key].replace(replacement[0], replacement[1]);
      });
    });
  }
  return sites;
}

function getSites () {
  if (!IS_DEV) {
    return Promise.resolve(sites);
  }
  return Promise.all([
    new Promise(function (resolve) {
      var req = new Image();
      req.addEventListener('load', function () {
        resolve(['https://mozvr.com/puzzle-rain/', ORIGIN_NO_PORT + ':9966/']);
      });
      req.addEventListener('error', function () {
        resolve([]);
      });
      req.src = ORIGIN_NO_PORT + ':9966/favicon.ico';
    }),
    new Promise(function (resolve) {
      var req = new Image();
      req.addEventListener('load', function () {
        resolve(['https://aframe.io/a-painter/', ORIGIN_NO_PORT + ':8080/']);
      });
      req.addEventListener('error', function () {
        resolve([]);
      });
      req.src = ORIGIN_NO_PORT + ':8080/favicon.ico';
    }),
    new Promise(function (resolve) {
      var req = new Image();
      req.addEventListener('load', function () {
        resolve(['https://aframe.io/aframe/', ORIGIN_NO_PORT + ':9000/']);
      });
      req.addEventListener('error', function () {
        resolve([]);
      });
      req.src = ORIGIN_NO_PORT + ':9000/favicon.ico';
    })
  ]).then(function (resolvedReqs) {
    resolvedReqs.forEach(function (replacement) {
      sites = transformSites(sites, replacement);
    });
    return Promise.resolve(sites);
  });
}

module.exports = getSites;
