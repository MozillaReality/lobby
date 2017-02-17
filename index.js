var AFRAME = require('aframe');
var TWEEN = require('tween.js');
require('aframe-dev-components');
require('aframe-look-at-component');
require('aframe-gradient-sky');
var extras = require('aframe-extras');
extras.registerAll();

require('./motion');
require('./transition');
require('./clouds');

var sites = require('./sites');

// var physics = require('aframe-physics-system');
// var widgets = require('aframe-ui-widgets');
// physics.registerAll();



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

    var radius = 0.5;         // radius of menu around user.
    var angle = Math.PI / 2;  // angle of menu.

    this.loaded = 0;
    this.bubbles = [];

    var controllers = document.querySelectorAll('a-entity[hand-controls]');
    this.controllers = Array.prototype.slice.call(controllers);

    this.ready = new Promise(function (resolve, reject) {
      for (var i = 0; i < sites.length; i++) {
        var bubble = document.createElement('a-entity');
        bubble.setAttribute('mixin', self.bubbleMixin);

        var x = radius * Math.cos(-2 * i * angle / sites.length);
        var z = radius * Math.sin(-2 * i * angle / sites.length);

        bubble.setAttribute('position', { x: x, y: 0, z: z });
        bubble.setAttribute('look-at', { x: 0, y: 0, z: 0 });
        bubble.setAttribute('data-url', sites[i].url);
        bubble.setAttribute('bob-y', {
          offset: 400 * i
        });
        bubble.className = 'bubble';

        var favicon = sites[i].favicon;
        var favEl;
        if (favicon) {
          var favEl = document.createElement('a-gltf-model');
          favEl.setAttribute('src', favicon);
          // favEl.setAttribute('mixin', 'gltf');
        } else {
          var favEl = document.createElement('a-entity');
          favEl.setAttribute('mixin', 'jewel');
          favEl.setAttribute('material', { color: self.colors[i]});
        }

        bubble.appendChild(favEl);

        var platform = document.createElement('a-entity');
        platform.setAttribute('mixin', 'platform');
        platform.setAttribute('position', { x: x, y: -0.16, z: z });

        self.el.appendChild(platform);

        var text = document.createElement('a-entity');
        text.setAttribute('text', {
          value: sites[i].name,
          align: 'center'
        });
        text.setAttribute('position', { x: 0, y: 0.15, z: 0 });
        bubble.appendChild(text);

        bubble.addEventListener('loaded', function () {
          self.loaded++;
          if (self.loaded === sites.length) {
            resolve();
          }
        });

        bubble.addEventListener('click', function (e) {
          var url = e.detail.target.dataset.url;
          console.log('navigating', url);
          self.navigate(url);
        });

        bubble.addEventListener('mouseenter', function (e) {
          var el = e.detail.target;
          el.setAttribute('mixin', self.bubbleMixin + ' ' + self.bubbleHover);
        });

        bubble.addEventListener('mouseleave', function (e) {
          var el = e.detail.target;
          el.setAttribute('mixin', self.bubbleMixin);
        });

        self.bubbles.push(bubble);
        self.el.appendChild(bubble);
      }
    });
  },

  navigate: function(url) {
    var transition = document.querySelector('a-entity[transition]').components.transition;

    console.log('Navigating to ', url);

    transition.out().then(function () {
     window.location.href = url;
    });
  },

  play: function () {
    this.ready.then(this.showMenu.bind(this));
  },

  pause: function () {
  },

  showMenu: function () {
    var self = this;
    var el = this.el;

    this.bubbles.forEach(function (bubble, i) {
      var position = bubble.getAttribute('position');
      var startY = position.y + 0.25;
      bubble.setAttribute('position', { y: startY });
      bubble.setAttribute('scale', { x: 0, y: 0, z: 0 });
      var tween = new TWEEN.Tween({ y: startY, scale: 0 })
        .to({ y: position.y, scale: 1 }, 1000)
        .delay(150 * i)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function () {
          bubble.setAttribute('position', {
            y: this.y
          });
          bubble.setAttribute('scale', {
            x: this.scale,
            y: this.scale,
            z: this.scale
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
      })
    });
  }
});
