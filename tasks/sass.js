'use strict';

const path = require('path');
const globby = require('globby');
const shell = require('shelljs');
const nodeSass = require('node-sass');
const inform = require('./inform');

const PRODUCTION = process.env.NODE_ENV === 'production';

const PATHS = {
  src: globby.sync('./styles/*.scss'),
  dest: './dist/css/'
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

function sass() {
  inform.start('Running Sass');
  const outputStyle = `--output-style ${(PRODUCTION ? 'compressed' : 'expanded')}`;
  const sourceMap = PRODUCTION ? '' : '--source-map true';

  shell.exec(`mkdir -p ${PATHS.dest}`);

  execSass(PATHS.src, outputStyle, '', sourceMap);
  return inform.done();
};

sass();
