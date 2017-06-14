'use strict';

const inform = require('../lib/inform');
const shell = require('shelljs');

module.exports = function postcss() {
  inform.start('Running PostCSS');
  shell.exec('postcss -c ./postcss.config.js');
  return inform.done();
};
