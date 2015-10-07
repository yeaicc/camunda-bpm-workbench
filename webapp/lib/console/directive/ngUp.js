'use strict';

var directive = function() {
  return function(scope, element, attrs) {

    element.bind("keydown keypress", function(event) {
      if(event.which === 38 && !event.shiftKey) {

        scope.$apply(function(){
          scope.$eval(attrs.ngUp, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
};

module.exports = directive;
