'use strict';

var directive = function() {
  return function(scope, element, attrs) {

    element.bind("keydown keypress", function(event) {
      if(event.which === 40 && !event.shiftKey) {

        scope.$apply(function(){
          scope.$eval(attrs.ngDown, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
};

module.exports = directive;
