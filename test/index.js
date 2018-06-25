const {readFileSync} = require('fs');
const {join} = require('path');
const sampleFileCodeStr = readFileSync(join(__dirname, './sampleFile.js'), 'utf8');

const logAssertStrictEquals = require('./utils/logAssertStrictEquals');
const undecorateWithBabel = require('./utils/undecorateWithBabel');
const evalAndGetModuleExports = require('./utils/evalAndGetModuleExports');
const testClassEquals = require('./utils/testClassEquals');

const untouchedDecoratedStr = `
  class WrappingClass {
    constructor() {
      this.passedInClass = aClass;
    }
  }
`;

(function testDefault() {
  const {
    default: AnyOldClass,
    AnotherClass,
    __undecorated__AnyOldClass,
    __undecorated__AnotherClass,
  } = evalAndGetModuleExports(
    undecorateWithBabel(sampleFileCodeStr)
  );

  const prependStr = 'Default Case';

  testClassEquals(`${prependStr}: AnyOldClass is untouched`, AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: AnotherClass is untouched`, AnotherClass, untouchedDecoratedStr);

  testClassEquals(`${prependStr}: decorators removed from __undecorated__AnyOldClass`, __undecorated__AnyOldClass, `
    class __undecorated__AnyOldClass {
      method() {
        console.log('hello');
      }
      otherMethod() {
      }
    }
  `);

  testClassEquals(`${prependStr}: decorators removed from __undecorated__AnotherClass`, __undecorated__AnotherClass, `
    class __undecorated__AnotherClass {
      method() {
        console.log('hello');
      }
    }
  `);
})();


(function testGivenPrefix() {
  const {
    default: AnyOldClass,
    AnotherClass,
    testing__AnyOldClass,
    testing__AnotherClass,
  } = evalAndGetModuleExports(
    undecorateWithBabel(sampleFileCodeStr, {
      undecoratedPrefix: 'testing__'
    })
  );

  const prependStr = 'Altered Prefix Case';

  testClassEquals(`${prependStr}: AnyOldClass is untouched`, AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: AnotherClass is untouched`, AnotherClass, untouchedDecoratedStr);

  testClassEquals(`${prependStr}: decorators removed from testing__AnyOldClass`, testing__AnyOldClass, `
    class testing__AnyOldClass {
      method() {
        console.log('hello');
      }
      otherMethod() {
      }
    }
  `);

  testClassEquals(`${prependStr}: decorators removed from testing__AnotherClass`, testing__AnotherClass, `
    class testing__AnotherClass {
      method() {
        console.log('hello');
      }
    }
  `);
})();


(function testSpecificClassRemoval() {
  const {
    default: AnyOldClass,
    AnotherClass,
    __undecorated__AnyOldClass,
    __undecorated__AnotherClass,
  } = evalAndGetModuleExports(
    undecorateWithBabel(sampleFileCodeStr, {
      specifically: ['anyOldClassDecorator']
    })
  );

  const prependStr = 'Specific Class Decorator Removal Case';

  testClassEquals(`${prependStr}: AnyOldClass is untouched`, AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: AnotherClass is untouched`, AnotherClass, untouchedDecoratedStr);

  testClassEquals(`${prependStr}: 'anyOldMethodDecorator' decorator still applied to 'method' on __undecorated__AnyOldClass`, __undecorated__AnyOldClass.prototype.method, `
    () => descriptor.value
  `);

  testClassEquals(`${prependStr}: 'whatAboutThisGuy' decorator still applied to 'otherMethod' on __undecorated__AnyOldClass`, __undecorated__AnyOldClass.prototype.otherMethod, `
    () => () => descriptor.value
  `);

  testClassEquals(`${prependStr}: 'anyOldMethodDecorator' decorator still applied to 'method' on __undecorated__AnotherClass`, __undecorated__AnotherClass.prototype.method, `
    () => descriptor.value
  `);
})();

(function testSpecificMethodRemoval() {
  const {
    default: AnyOldClass,
    AnotherClass,
    __undecorated__AnyOldClass,
    __undecorated__AnotherClass,
  } = evalAndGetModuleExports(
    undecorateWithBabel(sampleFileCodeStr, {
      specifically: ['anyOldMethodDecorator']
    })
  );

  const prependStr = 'Specific Method Decorator Removal Case';

  testClassEquals(`${prependStr}: AnyOldClass is untouched`, AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: AnotherClass is untouched`, AnotherClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: __undecorated__AnyOldClass returns wrapping class`, __undecorated__AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: __undecorated__AnotherClass returns wrapping class`, __undecorated__AnotherClass, untouchedDecoratedStr);

  testClassEquals(`${prependStr}: 'anyOldMethodDecorator' decorator not applied to 'method' on __undecorated__AnyOldClass`, new __undecorated__AnyOldClass().passedInClass.prototype.method, `
    method() {
      console.log('hello');
    }
  `);

  testClassEquals(`${prependStr}: 'whatAboutThisGuy' decorator still applied to 'otherMethod' on __undecorated__AnyOldClass`, new __undecorated__AnyOldClass().passedInClass.prototype.otherMethod, `
    () => () => descriptor.value
  `);

  testClassEquals(`${prependStr}: 'anyOldMethodDecorator' decorator not applied to 'method' on __undecorated__AnotherClass`, new __undecorated__AnotherClass().passedInClass.prototype.method, `
    method() {
      console.log('hello');
    }
  `);
})();

(function testOtherSpecificMethodRemoval() {
  const {
    default: AnyOldClass,
    AnotherClass,
    __undecorated__AnyOldClass,
    __undecorated__AnotherClass,
  } = evalAndGetModuleExports(
    undecorateWithBabel(sampleFileCodeStr, {
      specifically: ['whatAboutThisGuy']
    })
  );

  const prependStr = 'Other Specific Method Decorator Removal Case';

  testClassEquals(`${prependStr}: AnyOldClass is untouched`, AnyOldClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: AnotherClass is untouched`, AnotherClass, untouchedDecoratedStr);
  testClassEquals(`${prependStr}: __undecorated__AnyOldClass returns wrapping class`, __undecorated__AnyOldClass, untouchedDecoratedStr);

  logAssertStrictEquals(`${prependStr}: __undecorated__AnotherClass is undefined since no properties are targeted`, __undecorated__AnotherClass, undefined);

  testClassEquals(`${prependStr}: 'anyOldMethodDecorator' decorator still applied to 'method' on __undecorated__AnyOldClass`, new __undecorated__AnyOldClass().passedInClass.prototype.method, `
    () => descriptor.value
  `);

  testClassEquals(`${prependStr}: 'whatAboutThisGuy' decorator not applied to 'otherMethod' on __undecorated__AnyOldClass`, new __undecorated__AnyOldClass().passedInClass.prototype.otherMethod, `
    otherMethod() {
    }
  `);
})();
