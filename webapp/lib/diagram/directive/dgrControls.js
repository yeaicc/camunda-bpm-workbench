'use strict';

var fs = require('fs');

var jquery = require('jquery');

var Controller = ['$scope', function($scope) {

  $scope.openFsProcess = function() {

    // Yo!

    var obj = jquery('#dgr-uploader');
    obj[0].update = function() {
      var file = this.files[0];
      if (file !== null) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $scope.diagramManager.openProcess({
            xml: e.target.result,
            processDefinition: null
          });
        };
        reader.readAsText(file);
      }
    };

    obj.click();

  };

  $scope.newProcess = function() {
    $scope.diagramManager.createProcess();
  };

  $scope.isDeployed = function() {
    return !!$scope.workbench.processDebugger.processDefinitionId;
  };

}];


var directiveTemplate = fs.readFileSync(__dirname + '/dgrControls.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    template: directiveTemplate,
    controller: Controller
  };
};

