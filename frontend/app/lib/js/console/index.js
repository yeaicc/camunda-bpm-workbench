var angular = require('angular');

var ngModule = angular.module('developer.console', [
  require('./directive').name
]);

module.exports = ngModule;

