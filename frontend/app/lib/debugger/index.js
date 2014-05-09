var angular = require('angular');

var ngModule = angular.module('developer.debugger', [
  require('./service').name
//  require('./controller').name
]);

module.exports = ngModule;
