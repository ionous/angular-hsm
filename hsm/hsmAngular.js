// adds a new method to angular which creates "state controllers".
// state controllers add:
// * onEnter, onExit callbacks,
// * helpers for emitting new events, 
// * and helpers for accessing html attributes when customizing controllers.
angular.hsm = function(moduleName, directiveName, requireOrFn, fnOpt) {
  'use strict';
  var require, fn;
  if (!fnOpt) {
    fn = requireOrFn;
  } else {
    require = requireOrFn;
    fn = fnOpt;
  }
  // add requirements to the directive
  var requires = [directiveName, "^hsmState", "^^hsmMachine"].concat(require || []);
  //
  return angular.module(moduleName).
  directive(directiveName, function() {
    return {
      controller: fn,
      require: requires,
      scope: true, // an inherting scope, othewise we are putting objects directly into the parent scope.
      link: function(scope, element, attrs, controllers) {
        var ctrl = controllers[0];
        var hsmState = controllers[1];
        var hsmMachine = controllers[2];
        var directiveAttr = attrs[directiveName];
        // this api appears on the controller as: ctrl.name, ctrl.requires, etc.
        var api = {
          name: function() {
            return directiveAttr;
          },
          require: function(n) {
            var r = attrs[n];
            if (!r) {
              throw new Error(["hsm controller missing required attr", directiveName, directiveAttr, n, "not found"].join(" "));
            }
            return r;
          },
          optional: function(n, def) {
            return attrs[n] || def;
          },
          emit: function(event, data) {
            return hsmMachine.emit(directiveAttr, event, data);
          },
          onEnter: function() {},
          onExit: function() {},
          toString: function() {
            return api.name();
          },
        };
        var scopeAs = ctrl.init.apply(ctrl, [api].concat(controllers.slice(3)));
        if (angular.isUndefined(scopeAs)) {
          throw new Error(["hsm controller init() function missing return value", directiveName, directiveAttr].join(" "));
        }
        if (scopeAs !== null) {
          scope[directiveAttr] = scopeAs;
        }
        // the state is the element, its link comes last:
        // we need its on enter functions, so we use post link.
        var oldPost = ctrl.$postLink;
        ctrl.$postLink = function() {
          hsmState.onEnter(function(s, c) {
            api.onEnter(s, c);
          });
          hsmState.onExit(function(s, c) {
            api.onExit(s, c);
          });
          if (oldPost) {
            oldPost();
          }
        };
      }, // link
    }; // directive "descriptor"
  }); // hsmStateAs return
};
