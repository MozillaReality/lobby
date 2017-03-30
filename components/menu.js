AFRAME.registerComponent('menu', {
  init: function () {
    var self = this;

    this.getSites = module.exports.sites = require('../sites');

    this.bubbleHover = 'hovered';
    this.bubbleClass = 'selectable';

    this.loaded = 0;
    this.bubbles = [];
    this.transitioning = false;
  },

  play: function () {
    this.setupOptions();
  },

  pause: function () {
  },

  resetMenu: function () {
    this.bubbles = [];
    this.loaded = 0;
    while (this.el.hasChildNodes()) {
      this.el.removeChild(this.el.lastChild);
    };
  },

  loadMenu: function () {
    if (this.el.children.length > 0) {
      this.resetMenu();
    };

    this.loadSites()
      .then(this.showMenu.bind(this))
      .then(this.setupControllers.bind(this));
  },

  setupOptions: function () {
    var self = this;
    var options = [
      document.querySelector('#showcase'),
      document.querySelector('#recent')
    ];

    options.forEach(function (option, i) {
      if (i === 0) {
        self.optionSelect(option);
      }
      option.addEventListener('click', self.handleOptionSelect.bind(self));
      option.addEventListener('hit', self.handleOptionSelect.bind(self));
    });
  },

  handleOptionSelect: function (e) {
    var target = e.detail.target;
    this.optionSelect(target);
  },

  optionSelect: function (target) {
    var select = document.querySelector('#select');
    var selectPosition = select.getAttribute('position');
    var targetPosition = target.getAttribute('position');
    this.filter = target.dataset.filter;
    select.setAttribute('position', { x: targetPosition.x, y: selectPosition.y, z: selectPosition.z });

    this.loadMenu();
  },

  filterSites: function (sites) {
    var self = this;
    if (this.filter) {
      return sites.filter(function (site) {
        return site[self.filter] === true;
      });
    } else {
      return sites;
    }
  },

  loadSites: function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.getSites().then(function (sites) {
        sites = self.filterSites(sites);
        var radius = self.radius = 0.65; // radius of menu around user.
        var startAngle = -Math.PI / sites.length;
        var angle = startAngle / 2;

        sites.forEach(function (site, idx) {
          var x = radius * Math.cos(angle);
          var z = radius * Math.sin(angle);
          angle += startAngle;

          // site links
          var bubble = document.createElement('a-entity');
          bubble.setAttribute('link', {
            'url': site.start_url,
            'name': site.name,
            'favicon': site.processed_gltf_icon
          });
          bubble.setAttribute('position', { x: x, y: 0, z: z });
          bubble.setAttribute('look-at', { x: 0, y: 0, z: 0 });
          bubble.className = self.bubbleClass;

          bubble.addEventListener('loaded', function () {
            self.loaded++;
            if (self.loaded === sites.length) {
              resolve();
            }
          });
          bubble.addEventListener('click',self.handleItemSelect.bind(self));
          bubble.addEventListener('hit', self.handleItemSelect.bind(self));
          bubble.addEventListener('raycaster-intersected', function (e) {
            self.hovered = e.detail.target;
          });
          bubble.addEventListener('raycaster-intersected-cleared', function (e) {
            self.hovered = null;
          });

          self.bubbles.push(bubble);
          self.el.appendChild(bubble);
        });
      });
    })
  },

  handleItemSelect: function (e) {
    var self = this;
    var target = e.detail.target;
    var link = target.getAttribute('link');
    if (link.url === undefined) { return; }
    if (!self.transitioning) {
      self.transitioning = true;

      ['#selection', '#welcome'].forEach(function (select) {
        var el = document.querySelector(select);
        if (el) {
          el.setAttribute('visible', false);
        }
      });

      var titleEl = document.querySelector('#site-title');
      if (titleEl) {
        titleEl.setAttribute('text', { value: link.name });
      }
      var urlEl = document.querySelector('#site-url');
      if (urlEl) {
        urlEl.setAttribute('text', { value: link.url });
      }
      self.navigate(link.name, link.url, target);
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

  setupControllers: function () {
    var self = this;
    // touch and vive controllers
    controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));
    controllers.forEach(function (controller) {
      controller.setAttribute('aabb-collider', { objects: '.' + self.bubbleClass});
    });

    // daydream controller
    var remote = document.querySelector('a-entity[daydream-controller]');
    remote.setAttribute('raycaster', { objects: '.' + self.bubbleClass});
    remote.addEventListener('buttonup', function (e) {
      if (self.hovered) {
        //
      }
    });
    return;
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
    var count = this.bubbles.length;
    var bubbles = this.bubbles;
    return new Promise(function (resolve, reject) {
      bubbles.forEach(function (bubble, i) {
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
          .onComplete(function () {
            if (--count === 0) {
              resolve();
            }
          })
          .start();
      });
    });
  },

  tick: function (time) {
    TWEEN.update(time);
  }
});
