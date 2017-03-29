/* jshint node: true */
/* global require */

var settings = require('./settings');

function webvrLobby (opts) {
  opts = opts || {};
  var AFRAME = module.exports.AFRAME = opts.AFRAME || require('aframe');
  var TWEEN = module.exports.TWEEN = opts.TWEEN || require('tween.js');

  var THREE = module.exports.THREE = opts.THREE || AFRAME.THREE;

  module.exports['aframe-gradient-sky'] = opts['aframe-gradient-sky'] || require('aframe-gradient-sky');
  module.exports['aframe-dev-components'] = opts['aframe-dev-components'] || require('aframe-dev-components');
  module.exports['aframe-daydream-controller-component'] = opts['aframe-daydream-controller-component'] || require('aframe-daydream-controller-component');

  module.exports.menu = require('./components/menu');
  module.exports.link = require('./components/link');
  module.exports.motion = require('./components/motion');
  module.exports.transition = require('./components/transition');
  module.exports.title = require('./components/title');
  module.exports.clouds = require('./components/clouds');
  module.exports.aabb = require('./components/aabb-collider');
  module.exports.lookat = require('./components/look-at');

  // if (getSites && Array.isArray(getSites)) {
  //   getSites = Promise.resolve(getSites || []);
  // } else {
  //   getSites = Promise.resolve([]);
  // }

  function receiveMessage (evt) {
    var data = evt.data;
    if (!data) {
      return;
    }
    var src = data.src;
    if (!data || src !== 'webvr-agent') {
      return;
    }
    var action = data.action;
    console.log('[webvr-lobby] Received "%s" message:', action, data);
    if (action === 'steam-user-authenticated') {
      steamUserAuthenticated(data);
    } else if (action === 'steam-user-connected') {
      steamFriendConnected(data);
    } else if (action === 'steam-user-disconnected') {
      steamFriendDisconnected(data);
    }
  }

  function steamUserAuthenticated (data) {
    if (!data) {
      return;
    }
    var el = document.querySelector('#steam-name');
    if (!el) {
      // TODO: Create a new `<a-entity>` if one doesn't already exist.
    }
    var username = data.username;
    if (!username) {
      el.setAttribute('text', {
        value: ''
      });
      return;
    }
    el.setAttribute('text', {
      value: 'Signed in as ' + username
    });
  }

  function steamFriendConnected (data) {
    if (!data) {
      return;
    }
    var friendsEl = document.querySelector('#friends');
    if (!friendsEl) {
      return;
    }
    var username = data.username;
    friendsEl.setAttribute('visible', true);
    var friendEl = document.querySelector('#steam-friend-name');
    if (!friendEl) {
      // TODO: Create a new `<a-entity>` for this friend if one doesn't already exist.
    }
    friendEl.setAttribute('text', {
      value: `${username} is online`
    });
  }

  function steamFriendDisconnected (data) {
    if (!data) {
      return;
    }
    var friendsEl = document.querySelector('#friends');
    if (!friendsEl) {
      return;
    }
    var username = data.username;
    var friendEl = document.querySelector('#steam-friend-name');
    if (!friendEl) {
      // TODO: Create a new `<a-entity>` for this friend if one doesn't already exist.
    }
    friendEl.setAttribute('text', {
      value: `${username} is online`
    });
    // TODO: Add transition to fade out.
    setTimeout(function () {
      friendsEl.setAttribute('visible', false);
    }, 1000);
  }

  window.addEventListener('message', receiveMessage);

  var sceneEl = document.querySelector('a-scene');

  if (sceneEl) {
    if (sceneEl.hasLoaded) {
      enableStats();
    } else {
      sceneEl.addEventListener('loaded', enableStats);
    }
  } else {
    window.addEventListener('load', function () {
      sceneEl = document.querySelector('a-scene');
      enableStats();
    });
  }

  function enableStats () {
    if (settings.env === 'dev') {
      sceneEl.setAttribute('stats', '');
    }
  }
}

if (!module.parent) {
  webvrLobby();
}

module.exports = webvrLobby;
