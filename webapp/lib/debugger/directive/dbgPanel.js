'use strict';

var fs = require('fs');

var DbgController = ['$scope', function($scope) {

  // bootstrap the process debugger in the current scope
  $scope.processDebugger = $scope.workbench.processDebugger;

}];

var directiveTemplate = fs.readFileSync(__dirname + '/dbgPanel.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    scope: {
      workbench : "="
    },
    controller: DbgController,
    template: directiveTemplate,
  };
};

