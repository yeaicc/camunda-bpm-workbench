var fs = require('fs');

var angular = require('angular');

var ngModule = angular.module('developer.navigation.perspectiveSwitcher', []);

var directiveTemplate = fs.readFileSync(__dirname + '/navPerspectiveSwitcher.html', { encoding: 'utf-8' });

ngModule.directive('navPerspectiveSwitcher', [ '$location', function($location) {

  return {
    restrict: 'A',
    scope: {
      workbench: '='
    },
    template: directiveTemplate,
    link: function(scope, element, attrs) {

      var workbench = scope.workbench;

      scope.switchPerspective = function(newPerspective) {

        if (newPerspective === workbench.perspective) {
          return;
        }

        // deploy before switching perspective

        if (newPerspective === 'debug') {
          var processDebugger = workbench.processDebugger;

          if (!processDebugger.isSessionOpen()) {
            processDebugger.openSession();
          }

          processDebugger.deployProcess(function(data) {
            console.debug('deployed process', data);
            workbench.perspective = 'debug';
          });
        } else {
          workbench.perspective = newPerspective;
        }
      };

      scope.isActive = function(perspective) {
        return workbench.perspective === perspective;
      };
    }
  };
}]);

module.exports = ngModule;