var angular = require('angular');

var ngModule = angular.module('developer.scripteditor', [
  require('./directive').name
]);

module.exports = ngModule;
