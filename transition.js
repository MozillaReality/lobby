// var ExplodeModifier = require('./lib/ExplodeModifier');

AFRAME.registerComponent('transition', {
  init: function () {
    var self = this;

    var entity = document.createElement('a-entity');
    entity.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 1.5,
      buffer: false
    });

    entity.setAttribute('material', {
      color: 'black',
      shader: 'flat',
      side: 'back',
      opacity: 0
    });

    entity.addEventListener('loaded', function () {
      var mesh = entity.getObject3D('mesh');
      var geometry = mesh.geometry;
      // var explodeModifier = new ExplodeModifier();
      // explodeModifier.modify(geometry);

      // for (var i = 0; i < geometry.vertices.length; i++) {
      //   geometry.vertices[i].
      // };

      // explodeModifier(mesh)
    })

    this.transitionEl = entity;

    this.el.appendChild(entity);

    this.out = function() {
      return new Promise(function (resolve, reject) {
        var tween = new TWEEN.Tween({ opacity: 0 })
          .to({ opacity: 1 }, 1000)
          .onUpdate(function () {
            self.transitionEl.setAttribute('material', {
              opacity: this.opacity
            });
          })
          .onComplete(function () {
            resolve();
          })
          .start();
      });
    }

    this.in = new Promise(function (resolve, reject) {
      resolve();
    });

    this.loaded = new Promise(function (resolve) {
      entity.addEventListener('loaded', function () {
        resolve(this);
      });
    });
  },

  play: function () {
  },

  pause: function () {
  },

  tick: function (time) {
  }
});
