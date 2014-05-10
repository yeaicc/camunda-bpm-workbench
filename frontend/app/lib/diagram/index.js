var angular = require('angular');

var ngModule = angular.module('developer.diagram', [
  require('./directive').name,
]);

module.exports = ngModule;

