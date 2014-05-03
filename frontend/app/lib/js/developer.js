
require("camunda-simple-grid");

var jquery = require('jquery');
var angular = require('angular');


var ngModule = angular.module('developer', [
  require('./diagram').name,
  require('./debugger').name,
  require('./console').name
]);

/*ngModule.config([ '$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);*/

module.exports = ngModule;
