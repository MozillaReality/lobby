var ExplodeModifier = require('./lib/ExplodeModifier');

AFRAME.registerComponent('clouds', {
  init: function () {
    var self = this;


    var clouds = 80;
    var spread = 1000;
    var altitude = 50;
    var altitudeSpread = 50

    function randomInt (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    var h = Math.floor(Math.random() * 6) + 1;
    for (var i = 0; i < clouds; i++) {

      var entity = document.createElement('a-entity');
      entity.setAttribute('geometry', {
        primitive: 'plane',
        width: randomInt(10, 50),
        height: randomInt(50, 200)
      });
      entity.setAttribute('material', {
        color: 'white',
        side: 'front',
        opacity: 0.5
      });

      var x = randomInt(1, spread) - (spread / 2);
      var y = randomInt(altitude, altitude + altitudeSpread);
      var z = randomInt(1, spread) - randomInt(1, spread);
      console.log(x,y,z);
      entity.setAttribute('position', { x: x, y: y, z: z })
      entity.setAttribute('rotation', { x: 90 })

      this.el.appendChild(entity);

    }
  },

  play: function () {
  },

  pause: function () {
  },

  tick: function (time) {
  }
});
