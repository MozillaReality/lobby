var AFRAME = require('aframe');
var TWEEN = require('tween.js');
require('aframe-dev-components');
require('aframe-look-at-component');

require('./motion');
require('./transition');

var sites = require('./sites');

// var physics = require('aframe-physics-system');
// var widgets = require('aframe-ui-widgets');
// physics.registerAll();



AFRAME.registerComponent('menu', {
  init: function () {
    this.loaded = 0;
    this.ready = false;
    var radius = 0.5;
    var angle = Math.PI / 2;
    var self = this;
    this.colors = [
      0x6C77E8,
      0xE8A238,
      0xF83C98,
      0xD5E86E,
      0x24DFBF
    ]
    this.bubbles = [];

    var controllers = document.querySelectorAll('a-entity[hand-controls]');
    this.controllers = Array.prototype.slice.call(controllers);

    this.ready = new Promise(function(resolve, reject) {
      for (var i = 0; i < sites.length; i++) {
        var bubble = self.makeBubble(i, self.colors[i]);
        var x = radius * Math.cos(-2 * i * angle / sites.length);
        var z = radius * Math.sin(-2 * i * angle / sites.length);

        bubble.setAttribute('position', { x: x, y: 0, z: z });
        bubble.setAttribute('look-at', { x: 0, y: 0, z: 0 });
        bubble.setAttribute('data-url', sites[i].url);

        var platform = document.createElement('a-entity');
        platform.setAttribute('geometry', {
          primitive: 'cylinder',
          radius: 0.08,
          height: 0.01
        });
        platform.setAttribute('position', {
          x: x,
          y: -0.2,
          z: z
        });
        platform.setAttribute('material', {
          color: 0x8F9193
        });
        self.el.appendChild(platform);

        var text = self.makeText(sites[i].name);
        text.setAttribute('position', { x: 0, y: 0.15, z: 0 });
        bubble.appendChild(text);

        bubble.addEventListener('loaded', function () {
          self.loaded++;
          if (self.loaded === sites.length) {
            resolve();
          }
        });

        bubble.addEventListener('click', function (e) {
          self.navigate(e.detail.target.dataset.url);
        });

        bubble.addEventListener('mouseenter', function(e) {
          var el = e.detail.target;
          el.setAttribute('material', {
            color: 0x5B91FF
          });
        });

        bubble.addEventListener('mouseleave', function(e) {
          var el = e.detail.target;
          el.setAttribute('material', {
            color: 'lightblue'
          });
        });

        self.bubbles.push(bubble);
        self.el.appendChild(bubble);
      }
    });
  },

  navigate: function(url) {
    var transition = document.querySelector('a-entity[transition]').components.transition;

    console.log('Navigating to ', url);

    transition.in().then(function() {
      window.location.href = url;
    });
  },

  play: function () {
    this.ready.then(this.showMenu.bind(this));
  },

  pause: function () {
  },

  showMenu: function() {
  },

  makeText: function(text) {
    var entity = document.createElement('a-entity');
    entity.setAttribute('text', {
      value: text,
      align: 'center'
    });
    return entity;
  },

  makeBubble: function (index, color) {
    var bubble = document.createElement('a-entity');
    bubble.className = 'bubble';
    bubble.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.1
    });
    bubble.setAttribute('material', {
      color: "lightblue",
      opacity: 0.2
    });
    bubble.setAttribute('bob-y', {
      offset: (index + 1) * 500
    });

    var shape = document.createElement('a-entity');
    shape.setAttribute('geometry', {
      primitive: 'octahedron',
      radius: 0.05
    });
    shape.setAttribute('material', {
      color: color
    })
    shape.setAttribute('rotate-y-axis', '');
    bubble.appendChild(shape);

    return bubble;
  },

  tick: function (time) {
    var self = this;
    this.controllers.forEach(function(controller) {
      var controllerBB = new THREE.Box3().setFromObject(controller.object3D);

      self.bubbles.forEach(function(bubble) {
        var meshBB = new THREE.Box3().setFromObject(bubble.getObject3D('mesh'));
        var collision = meshBB.intersectsBox(controllerBB);

        if (collision) {
          //console.log('collision');
        }
      })
    });
  }
});
