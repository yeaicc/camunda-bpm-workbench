var angular = require('angular');

var ngModule = angular.module('developer.diagram', [
  require('./directive').name,
  require('./service').name,
  require('./controller').name
]);

module.exports = ngModule;

