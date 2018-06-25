@anyOldClassDecorator
export default class AnyOldClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');
  }

  @whatAboutThisGuy
  otherMethod() {
  }
}

@anyOldClassDecorator
export class AnotherClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');
  }
}

function anyOldClassDecorator(aClass) {
  return class WrappingClass {
    constructor() {
      this.passedInClass = aClass;
    }
  };
}

function anyOldMethodDecorator(target, key, descriptor) {
  const clone = Object.keys(descriptor).reduce((accum, curr) => {
    accum[curr] = descriptor[curr];
    return accum;
  }, {});

  clone.value = () => descriptor.value;

  return clone;
}

function whatAboutThisGuy(target, key, descriptor) {
  const clone = Object.keys(descriptor).reduce((accum, curr) => {
    accum[curr] = descriptor[curr];
    return accum;
  }, {});

  clone.value = () => () => descriptor.value;

  return clone;;
}
