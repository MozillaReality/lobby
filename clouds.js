var ExplodeModifier = require('./lib/ExplodeModifier');

AFRAME.registerComponent('clouds', {
  init: function () {
    var self = this;

    var clouds = 80;
    var spread = 1000;
    this.spread = spread;
    var altitude = 50;
    var altitudeSpread = 50

    function randomInt (min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    this.clouds = [];

    for (var i = 0; i < clouds; i++) {
      var entity = document.createElement('a-entity');

      entity.setAttribute('geometry', {
        primitive: 'plane',
        width: randomInt(10, 50),
        height: randomInt(50, 200)
      });

      entity.setAttribute('material', {
        color: '#F5DCFF',
        side: 'front',
        opacity: 0.4
      });

      var x = randomInt(1, spread) - (spread / 2);
      var y = randomInt(altitude, altitude + altitudeSpread);
      var z = randomInt(1, spread) - randomInt(1, spread);

      entity.setAttribute('position', { x: x, y: y, z: z })
      entity.setAttribute('rotation', { x: 90 })

      this.clouds.push(entity);
      this.el.appendChild(entity);
    }
  },

  play: function () {
    this.running = true;
  },

  pause: function () {
    this.running = false;
  },

  tick: function (time) {
    var self = this;
    if (!this.running) return;
    this.clouds.forEach(function (cloud) {
      var position = cloud.getAttribute('position');

      if (Math.abs(position.z) > self.spread) {
        position.z = -self.spread;
      }
      cloud.setAttribute('position', { z: position.z + 0.1 });

    })
  }
});
