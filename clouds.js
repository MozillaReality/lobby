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
      entity.setAttribute('mixin', 'cloud');
      entity.setAttribute('scale', {
        y: randomInt(50, 200),
        x: randomInt(10, 50),
        z: 1
      });

      var x = randomInt(1, spread) - (spread / 2);
      var y = randomInt(altitude, altitude + altitudeSpread);
      var z = randomInt(1, spread) - randomInt(1, spread);

      entity.setAttribute('position', { x: x, y: y, z: z });

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
