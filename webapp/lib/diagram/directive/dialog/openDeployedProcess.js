var fs = require('fs');


var dialogTemplate = fs.readFileSync(__dirname + '/openDeployedProcess.html', { encoding: 'utf-8' });


var DialogController = ['$scope', '$modalInstance', 'workbench', 'processEngineConnection',
    function($scope, $modalInstance, workbench, processEngineConnection) {

  $scope.processList = [];  
  $scope.workbench = workbench;

      function loadProcessDefinitions() {
        $scope.processList = processEngineConnection.listProcessDefinitions(function(data) {
          //console.log(data);
          $scope.$apply(function () {
            $scope.processList = data;
          });
        });
      }

      processEngineConnection.addEngineChangedListener(function() {
        loadProcessDefinitions();
      });

       // TODO: Think about loading order
      //loadProcessDefinitions();

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.selectProcess = function(process) {
    $modalInstance.close(process);
  };
}];

function OpenDeployedProcessModal(workbench) {
  return {
    template: dialogTemplate,
    controller: DialogController,
    resolve: {
      processEngineConnection: function() {
        return workbench.processEngineConnection;
      },
      workbench : function() {
        return workbench;
      }

    }
  }
};

module.exports = OpenDeployedProcessModal;