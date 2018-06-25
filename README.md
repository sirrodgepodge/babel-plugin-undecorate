# babel-plugin-undecorate
Remove class+method decorators for testing, but keep them in your code!

Decorators are quite popular and are finally on their way to being here to stay: https://github.com/tc39/proposal-decorators#69

However there seem to as of yet be no good ways to access the underlying decorated classes/methods for unit tests.  All sources seem to suggest getting rid of our lovely decorators!

https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c
https://stackoverflow.com/questions/37798741/nested-components-testing-with-enzyme-inside-of-react-redux
https://hacks.mozilla.org/2018/04/testing-strategies-for-react-and-redux/

This package attempts to address this issue by automatically exporting a copy (not a reference) to the underlying classes+methods (see below).

Can either copy all classes with decorators (with the decorators removed) or target specific decorators.

*Note that this package only looks for decorators on "Export" nodes at present (so if you were to assign a decorated class to a variable and export the variable it would not work).

## Example Usage

### .babelrc
```js
{
  plugins: [["undecorate", {
    specifically: ["anyOldClassDecorator", "anyOldMethodDecorator"]
  }], ...]
}
```

### sampleFile.js
```js
@anyOldClassDecorator
export default class AnyOldClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');  	
  }

  @whatAboutThisGuy
  method2() {
  }
}

@anyOldClassDecorator
export class AnotherClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');  	
  }
}
```
#### output
```js
@anyOldClassDecorator
export default class AnyOldClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');  	
  }

  @whatAboutThisGuy
  method2() {
    console.log('hello2');
  }
}

export class __undecorated__AnyOldClass {
  method() {
    console.log('hello');  	
  }

  @whatAboutThisGuy
  method2() {
    console.log('hello2');
  }
}

@anyOldClassDecorator
export class AnotherClass {
  @anyOldMethodDecorator
  method() {
    console.log('hello');  	
  }
}

export class __undecorated__AnotherClass {
  method() {
    console.log('hello');  	
  }
}
```

## Options
### specifically <Array> (default: undefined)
Allows only removing specific decorators (by name), if not passed in plugin will remove all decorators.

### undecoratedPrefix <String> (default: "__undecorated__")
The string which class exports that have been undecorated will be prepended with.
