const undecoratePlugin = require('../../');
const babelTransform = require('babel-core').transform;

module.exports = function undecorateWithBabel(codeStr, undecoratorOptions = {}) {
  const { code: defaultsCode } = babelTransform(codeStr, {
    "plugins": [
      [undecoratePlugin, undecoratorOptions],
      "transform-decorators-legacy",
      "transform-es2015-modules-commonjs"
    ]
  });

  return defaultsCode;
};
