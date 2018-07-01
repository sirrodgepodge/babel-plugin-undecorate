const babelTransform = require('babel-core').transform;

module.exports = function undecorateWithBabel(codeStr, undecoratorOptions = {}) {
  const { code: defaultsCode } = babelTransform(codeStr, {
    "presets": ["stage-0"], // added to ensure tests pass with this very common preset
    "plugins": [
      ["../../../", undecoratorOptions],
      "transform-decorators-legacy",
      "transform-es2015-modules-commonjs"
    ]
  });

  return defaultsCode;
};
