var IS_DEV = window.location.port !== 80 && window.location.port !== 443;
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

var a_painter = {
  name: 'A-Painter',
  url: 'https://aframe.io/a-painter/'
};

var shadows_and_fog = {
  name: 'Shadows and Fog',
  url: 'https://aframe.io/aframe/examples/showcase/spheres-and-fog/'
};

if (IS_DEV) {
  ['url', 'favicon'].forEach(function (key) {
    if (!(key in puzzle_rain)) {
      return;
    }
    puzzle_rain[key] = puzzle_rain[key].replace(
      'https://mozvr.com/puzzle-rain/',
      ORIGIN_NO_PORT + ':9966/'
    );
  });
  ['url', 'favicon'].forEach(function (key) {
    if (!(key in a_painter)) {
      return;
    }
    a_painter[key] = a_painter[key].replace(
      'https://aframe.io/a-painter/',
      ORIGIN_NO_PORT + ':8080/'
    );
  });
  ['url', 'favicon'].forEach(function (key) {
    if (!(key in shadows_and_fog)) {
      return;
    }
    shadows_and_fog[key] = shadows_and_fog[key].replace(
      'https://aframe.io/aframe/',
      ORIGIN_NO_PORT + ':9000/'
    );
  });
}

module.exports = [
  shadows_and_fog,
  puzzle_rain,
  a_painter,
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
