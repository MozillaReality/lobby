AFRAME.registerComponent('transition', {
  init: function () {
    var self = this;

    var entity = document.createElement('a-entity');
    entity.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 100
    });

    entity.setAttribute('position', { y: 1 })
    entity.setAttribute('material', {
      color: "black",
      side: "back",
      opacity: 0
    });

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
