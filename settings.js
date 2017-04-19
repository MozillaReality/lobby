var IS_DEV = window.location.port && (window.location.hostname.split('.').length === 4 || window.location.hostname === 'localhost');

module.exports = {
  env: IS_DEV ? 'dev' : 'prod'
};
