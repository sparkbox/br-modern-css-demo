'use strict';

const path = require('path');
const fs = require('fs');
const globby = require('globby');
const inform = require('./inform.js');
const shell = require('shelljs');
const nodeSass = require('node-sass');
const splinter = require('scss-splinter');

const PRODUCTION = process.env.NODE_ENV === 'production';

const PATHS = {
  src: globby.sync('./src/scss/!(_|brand)*.scss'),
  brandSrc: globby.sync('./src/scss/brand.*.scss'),
  dest: './dist/includes/css',
  global: './dist/includes/css/global.css',
};

const getDest = (file) => {
  const fileName = path.basename(file, '.scss');
  return `${path.join(PATHS.dest, fileName)}.css`;
};

const execSass = (src, outputStyle, includePaths, sourceMap) => {
  src.forEach((file) => {
    const dest = getDest(file);
    shell.exec(`node-sass ${file} ${outputStyle} ${includePaths} ${sourceMap} ${dest}`);
  });
};

/* eslint consistent-return: 0*/
module.exports = function sass() {
  return new Promise((done) => {
    inform.start('Parsing Brands');

    const outputStyle = `--output-style ${(PRODUCTION ? 'compressed' : 'expanded')}`;
    const sourceMap = PRODUCTION ? '' : '--source-map true';
    const includePaths = '--include-path ./node_modules/sass-list-maps';

    shell.exec(`mkdir -p ${PATHS.dest}`);

    execSass(PATHS.src, outputStyle, includePaths, sourceMap);

    splinter({
      partial: 'src/scss/_brands.scss',
      base: 'src/scss/_base.scss',
    })
    .then((scss) => {
      const compiledGlobal = nodeSass.renderSync({
        outFile: PATHS.global,
        sourceMap: !PRODUCTION,
        outputStyle: PRODUCTION ? 'compressed' : 'expanded',
        data: scss,
      });

      fs.writeFileSync(PATHS.global, compiledGlobal.css.toString());

      inform.start('Compiling Sass');

      execSass(PATHS.brandSrc, outputStyle, includePaths, sourceMap);

      inform.done();
      done();
    });
  });
};
