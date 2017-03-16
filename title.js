// var ExplodeModifier = require('./lib/ExplodeModifier');

AFRAME.registerComponent('title', {
  init: function () {
    var self = this;

    var children = Array.prototype.slice.call(this.el.children);

    this.show = function() {
      return new Promise(function (resolve, reject) {
        self.el.setAttribute('visible', true);
        var tweenIn = new TWEEN.Tween({ opacity: 0 })
          .to({ opacity: 1 }, 1000)
          .onUpdate(function () {
            var opacity = this.opacity;
            children.forEach(function (textEl) {
              textEl.setAttribute('text', { opacity: opacity });
            })
          })
          .delay(2000)
          .onComplete(resolve)
          .start();
      });
    }
  },

  play: function () {
  },

  pause: function () {
  },

  tick: function (time) {
  }
});
