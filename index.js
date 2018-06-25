module.exports = function getUndecorateBabelPlugin({ types: t}) {
  return {
    name: "undecorate",
    visitor: {
      Program(path, state) {
        var shouldKeepDecorator = function rejectAllDecorators() { return false; }

        if (state.opts.specifically) {
          var specificallySet = state.opts.specifically.reduce(function makePseudoSet(o, decoratorToBeExcluded) {
          	o[decoratorToBeExcluded] = true;
          	return o;
          }, {});

          shouldKeepDecorator = function rejectSpecificDecorators(decoratorName) { return !specificallySet[decoratorName]; }
        }

        path.node.body = path.node.body.reduce(function removeClassDecorators(output, node) {
          output.push(node);
          if (
            t.isExportNamedDeclaration(node)
            ||
            t.isExportDefaultDeclaration(node)
          ) {
            var modified = false;

            function filterOutDecorators(decorator) {
              var testResult = shouldKeepDecorator(decorator.expression.name);
              if (!testResult) modified = true;
              return testResult;
            }

            var classNode = node.declaration;
            if (t.isClassDeclaration(classNode)) {
              var clonedClassNode = classNode.__clone();

			        if (clonedClassNode.decorators) {
              	clonedClassNode.decorators = clonedClassNode.decorators.filter(filterOutDecorators);
              }

              var clonedClassNodeBody = clonedClassNode.body.__clone();
              clonedClassNode.body = clonedClassNodeBody;
              clonedClassNodeBody.body = clonedClassNodeBody.body.map(function removeMethodDecorators(classProperty) {
                if (!t.isClassMethod(classProperty)) {
                  return classProperty;
                } else {
                  var clonedClassProperty = classProperty.__clone();
                  if (clonedClassProperty.decorators) {
                  	clonedClassProperty.decorators = clonedClassProperty.decorators.filter(filterOutDecorators);
                  }
                  return clonedClassProperty;
                }
              });

              if (modified) {
                var undecoratedPrefix = state.opts.undecoratedPrefix || '__undecorated__';

                clonedClassNode.id = clonedClassNode.id.__clone();
                clonedClassNode.id.name = undecoratedPrefix + clonedClassNode.id.name;

                var clonedExportNode = node.__clone();
                clonedExportNode.type = 'ExportNamedDeclaration'; // need to do named export always, can't have two default exports
                clonedExportNode.declaration = clonedClassNode;

              	output.push(clonedExportNode);
              }
            }
          }
          return output;
        }, []);
      },
    }
  };
}
