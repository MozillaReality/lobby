// var ExplodeModifier = require('./lib/ExplodeModifier');

AFRAME.registerComponent('link', {
  schema: {
    'url': { type: 'string', default: '#' },
    'name': { type: 'string' },
    'favicon': { type: 'string' }
  },

  init: function () {
    this.colors = [
      0x6C77E8,
      0xE8A238,
      0xF83C98,
      0xD5E86E,
      0x24DFBF
    ];
  },

  play: function () {
  },

  pause: function () {
  },

  update: function () {
    // favicon
    var favicon = this.data.favicon;
    var favEl;
    if (favicon) {
      favEl = document.createElement('a-gltf-model');
      favEl.setAttribute('src', favicon);
    } else {
      favEl = document.createElement('a-entity');
      favEl.setAttribute('mixin', 'jewel');
      favEl.setAttribute('material', { color: 0x6C77E8 });
    }
    favEl.setAttribute('rotate-y-axis', '');

    this.el.setAttribute('geometry', {
      primitive: 'box',
      width: 0.25,
      height: 0.25,
      depth: 0.25
    });
    this.el.setAttribute('material', {
      visible: false
    })

    this.el.appendChild(favEl);

    // bubble platform
    var platform = document.createElement('a-entity');
    platform.setAttribute('mixin', 'platform');
    platform.setAttribute('position', { y: -0.15 });
    platform.className = 'platform';
    this.el.appendChild(platform);

    // bubble text label
    var text = document.createElement('a-entity');
    text.setAttribute('mixin', 'label');
    text.className = 'title';
    text.setAttribute('text', {
      value: this.data.name,
      align: 'center'
    });
    this.el.appendChild(text);
  },

  tick: function (time) {
  }
});
