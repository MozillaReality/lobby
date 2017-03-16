/* jshint node: true */
/* global require */

function webvrLobby (opts) {
  opts = opts || {};
  var AFRAME = module.exports.AFRAME = opts.AFRAME || require('aframe');
  var TWEEN = module.exports.TWEEN = opts.TWEEN || require('tween.js');

  var THREE = module.exports.THREE = opts.THREE || AFRAME.THREE;

  module.exports['aframe-look-at-component'] = opts['aframe-look-at-component'] || require('aframe-look-at-component');
  module.exports['aframe-gradient-sky'] = opts['aframe-gradient-sky'] || require('aframe-gradient-sky');

  module.exports.motion = require('./components/motion');
  module.exports.transition = require('./components/transition');
  module.exports.title = require('./components/title');
  module.exports.clouds = require('./components/clouds');
  module.exports.aabb = require('./components/aabb-collider');

  var getSites = module.exports.sites = opts.sites || require('./sites');

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

  AFRAME.registerComponent('menu', {
    init: function () {
      var self = this;
      this.bubbleMixin = 'bubble';
      this.bubbleHover = 'hovered';
      this.colors = [
        0x6C77E8,
        0xE8A238,
        0xF83C98,
        0xD5E86E,
        0x24DFBF
      ];

      this.loaded = 0;
      this.bubbles = [];
      this.transitioning = false;

      var controllers = document.querySelectorAll('a-entity[hand-controls]');
      this.controllers = Array.prototype.slice.call(controllers);

      this.ready = new Promise(function (resolve, reject) {
        getSites().then(function (sites) {
          var radius = self.radius = 0.65; // radius of menu around user.
          var startAngle = -Math.PI / sites.length;
          var angle = startAngle / 2;

          sites.forEach(function (site, idx) {
            var x = radius * Math.cos(angle);
            var z = radius * Math.sin(angle);
            angle += startAngle;

            // bubble icons
            var bubble = document.createElement('a-entity');
            bubble.setAttribute('position', { x: x, y: 0, z: z });
            bubble.setAttribute('look-at', { x: 0, y: 0, z: 0 });
            bubble.setAttribute('data-url', site.start_url);
            bubble.setAttribute('data-name', site.name);
            bubble.setAttribute('bob-y', { offset: 400 * idx });
            bubble.className = 'bubble';

            // favicon
            var favicon = site.processed_gltf_icon;
            var favEl;
            if (favicon) {
              favEl = document.createElement('a-gltf-model');
              favEl.setAttribute('src', favicon);
            } else {
              favEl = document.createElement('a-entity');
              favEl.setAttribute('mixin', 'jewel');
              favEl.setAttribute('material', { color: self.colors[idx]});
            }
            favEl.setAttribute('rotate-y-axis', '');
            bubble.appendChild(favEl);

            // bubble platform
            var platform = document.createElement('a-entity');
            platform.setAttribute('mixin', 'platform');
            platform.setAttribute('position', { y: -0.16 });
            platform.className = 'platform';
            // platform.setAttribute('position', { x: x, y: -0.16, z: z });
            bubble.appendChild(platform);

            // bubble text label
            var text = document.createElement('a-entity');
            text.setAttribute('mixin', 'label');
            text.className = 'title';
            text.setAttribute('text', {
              value: site.name,
              align: 'center'
            });
            bubble.appendChild(text);

            bubble.addEventListener('loaded', function () {
              self.loaded++;
              if (self.loaded === sites.length) {
                resolve();
              }
            });

            bubble.addEventListener('click',self.handleInteraction.bind(self));
            bubble.addEventListener('hit', self.handleInteraction.bind(self));

            // bubble.addEventListener('mouseenter', function (e) {
            //   var el = e.detail.target;
            //   el.setAttribute('mixin', self.bubbleMixin + ' ' + self.bubbleHover);
            // });

            // bubble.addEventListener('mouseleave', function (e) {
            //   var el = e.detail.target;
            //   el.setAttribute('mixin', self.bubbleMixin);
            // });

            self.bubbles.push(bubble);
            self.el.appendChild(bubble);
          });
        });
      });
    },

    handleInteraction: function (e) {
      var self = this;
      var target = e.detail.target;
      var url = target.dataset.url;
      var name = target.dataset.name;
      if (url === undefined) { return; }
      if (!self.transitioning) {
        self.transitioning = true;
        var welcomeEl = document.querySelector('#welcome');
        if (welcomeEl) {
          welcomeEl.setAttribute('visible', false);
        }
        var titleEl = document.querySelector('#site-title');
        if (titleEl) {
          titleEl.setAttribute('text', { value: name });
        }
        var urlEl = document.querySelector('#site-url');
        if (urlEl) {
          urlEl.setAttribute('text', { value: url });
        }
        self.navigate(name, url, target);
      }
    },

    navigate: function(name, url, bubble) {
      var transition = document.querySelector('a-entity[transition]').components.transition;
      var title = document.querySelector('a-entity[title]').components.title;
      this.selectMenu(bubble)
        .then(function () {
          return title.show();
        })
        .then(function () {
          return transition.out(name, url);
        })
        .then(function () {
          console.log('Navigating to ', url);
          window.location.href = url;
        });
    },

    play: function () {
      this.ready.then(this.showMenu.bind(this));
    },

    pause: function () {
    },

    selectMenu: function (target) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.bubbles.forEach(function (bubble, i) {
          var position = bubble.getAttribute('position');

          var delay = (target === bubble) ? delay = self.bubbles.length * 250 : i * 150;
          var toX = (target === bubble) ? 0 : position.x;
          var toY = (target === bubble) ? 0 : position.y + 0.1;
          var toZ = (target === bubble) ? -self.radius : position.z;
          var toScale = (target === bubble) ? 1.5 : 0;

          new TWEEN.Tween({ x: position.x, y: position.y, z: position.z, scale: 1 })
            .to({ x: toX, y: toY, z: toZ, scale: toScale }, 600)
            .easing(TWEEN.Easing.Back.InOut)
            .delay(delay)
            .onUpdate(function () {
              bubble.setAttribute('position', {
                x: this.x, y: this.y, z: this.z
              });
              bubble.setAttribute('scale', {
                x: this.scale, y: this.scale, z: this.scale
              });
            })
            .onStart(function () {
              if (target === bubble) {
                bubble.querySelector('.title').setAttribute('visible', false);
                bubble.querySelector('.platform').setAttribute('visible', false);
              }
            })
            .onComplete(resolve)
            .start();
        });
      });
    },

    showMenu: function () {
      this.bubbles.forEach(function (bubble, i) {
        var position = bubble.getAttribute('position');
        var startY = position.y + 0.25;
        bubble.setAttribute('position', { y: startY });
        bubble.setAttribute('scale', { x: 0, y: 0, z: 0 });
        new TWEEN.Tween({ y: startY, scale: 0 })
          .to({ y: position.y, scale: 1 }, 1000)
          .delay(150 * i)
          .easing(TWEEN.Easing.Back.InOut)
          .onUpdate(function () {
            bubble.setAttribute('position', {
              y: this.y
            });
            bubble.setAttribute('scale', {
              x: this.scale, y: this.scale, z: this.scale
            });
          })
          .start();
      });
    },

    tick: function (time) {
      TWEEN.update(time);
      var self = this;
      this.controllers.forEach(function (controller) {
        var controllerBB = new THREE.Box3().setFromObject(controller.object3D);

        self.bubbles.forEach(function (bubble) {
          var meshBB = new THREE.Box3().setFromObject(bubble.getObject3D('mesh'));
          var collision = meshBB.intersectsBox(controllerBB);

          if (collision) {
            //console.log('collision');
          }
        });
      });
    }
  });
}

if (!module.parent) {
  webvrLobby();
}

module.exports = webvrLobby;
