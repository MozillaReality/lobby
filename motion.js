
AFRAME.registerComponent('rotate-y-axis', {
  init: function () {
    this.rotate = true;
  },
  play: function () {
    this.rotate = true;
  },
  pause: function () {
    this.rotate = false;
  },
  tick: function () {
    if (!this.rotate) return false;
    var el = this.el;
    var rotation = el.getAttribute('rotation');

    el.setAttribute('rotation', {
      x: rotation.x,
      y: rotation.y + 1,
      z: rotation.z,
    });
  }
});

AFRAME.registerComponent('bob-y', {
  schema: {
    offset: { type: 'int', default: 0 }
  },

  init: function () {
    this.running = true;
  },

  play: function () {
    this.running = true;
  },

  pause: function () {
    this.running = false;
  },

  tick: function (time) {
    if (!this.running) return false;
    var el = this.el;
    var position = el.getAttribute('position');

    time += this.data.offset;

    el.setAttribute('position', {
      x: position.x,
      y: position.y + Math.sin(time / 1000) * 0.0005,
      z: position.z
    })
  }
});