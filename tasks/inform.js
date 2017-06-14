const chalk = require('chalk');

const timer = {
  startTime: null,
  endTime: null,
  start() {
    return this.startTime = Date.now();
  },
  stop() {
    return this.endTime = Date.now();
  },
  time() {
    return `\n--- DONE ${ (this.endTime - this.startTime) / 1000 } seconds ---`;
  }
};

exports.start = function start(msg) {
  timer.start();
  return console.log('\n' + chalk.bgBlue.black(` - ${ msg } - `));
}

exports.msg = function msg(msg) {
  return console.log(chalk.cyan(msg));
}

exports.done = function done(msg) {
  timer.stop();
  if(msg) console.log('\n' + msg);
  return console.log(timer.time());
}

exports.err = function err(msg) {
  return console.log(chalk.bgRed.bold(msg));
}
