var IS_DEV = window.location.port !== 80 && window.location.port !== 443;
var ORIGIN = window.location.protocol + '//' + window.location.host;
var ORIGIN_NO_PORT = window.location.protocol + '//' + window.location.hostname;

if (IS_DEV) {
  var webvrAgentScript = document.querySelector('script[src*="agent"][src*="/client.js"]');
  if (webvrAgentScript) {
    webvrAgentScript.src = webvrAgentScript.src.replace(/(.+)client.js/, ORIGIN_NO_PORT + ':4040/client.js');
  }
}

var puzzle_rain = {
  name: 'Puzzle Rain',
  url: 'https://mozvr.com/puzzle-rain/?mode=normal&src=moonrise',
  favicon: 'https://mozvr.com/puzzle-rain/models/gltf/puzzle-rain.gltf'
};

if (IS_DEV) {
  ['url', 'favicon'].forEach(function (key) {
    puzzle_rain[key] = puzzle_rain[key].replace(
      'https://mozvr.com/puzzle-rain/',
      ORIGIN_NO_PORT + ':9966/'
    );
  });
}

module.exports = [
  puzzle_rain,
  {
    name: 'A-Painter',
    url: 'https://aframe.io/a-painter/'
  },
  {
    name: 'A-Blast',
    url: 'https://aframe.io/a-blast/'
  },
  {
    name: 'Sketchfab',
    url: 'https://sketchfab.com/vr'
  },
  {
    name: 'Finding Love',
    url: 'https://findinglove.activetheory.net/'
  }
];
