var angular = require('angular');

var ngModule = angular.module('developer.debugger', [
  require('./directive').name
]);

module.exports = ngModule;
