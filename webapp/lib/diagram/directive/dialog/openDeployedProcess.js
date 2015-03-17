var fs = require('fs');


var dialogTemplate = fs.readFileSync(__dirname + '/openDeployedProcess.html', { encoding: 'utf-8' });


var DialogController = ['$scope', '$modalInstance', 'serverSession',
    function($scope, $modalInstance, serverSession) {

  $scope.processList = [];

  serverSession.listProcessDefinitions().success(function(definitions) {
    $scope.processList = definitions;
    $scope.$digest();
  });

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.selectProcess = function(process) {
    $modalInstance.close(process);
  };
}];

function OpenDeployedProcessModal(serverSession) {
  return {
    template: dialogTemplate,
    controller: DialogController,
    resolve: {
      serverSession: function() {
        return serverSession;
      }
    }
  }
};

module.exports = OpenDeployedProcessModal;