const logAssertStrictEquals = require('./logAssertStrictEquals');
const chalk = require('chalk');

module.exports = function testClassEquals(message, class1, class2) {
  return logAssertStrictEquals(
    message,
    class1.toString().replace(/\s/g, ''),
    class2.toString().replace(/\s/g, '')
  );
}
