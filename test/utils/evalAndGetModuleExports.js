module.exports = function evalAndGetModuleExports(codeStr) {
  const _____containerObj_____ = {};
  eval(codeStr
    .replace(/module\.exports/g, '_____containerObj_____')
    .replace(/exports/g, '_____containerObj_____')
  );
  return _____containerObj_____;
}
