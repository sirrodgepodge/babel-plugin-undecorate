const {strictEqual} = require('assert');
const chalk = require('chalk');

module.exports = function logAssertStrictEquals(message, actual, expected) {
  try {
    strictEqual(actual, expected);
    console.log(chalk.green(`SUCCESS: ${message}`));
  } catch (e) {
    console.log(chalk.red(`FAILURE: ${message}`));
    console.log(chalk.red('EXPECTED:\n' + expected + '\n'));
    console.log(chalk.redBright('RECEIVED:\n' + actual + '\n'));
  }
}
