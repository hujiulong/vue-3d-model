const pkg = require('./package.json');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/' + pkg.name
    : '/',
};
