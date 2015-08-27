var angular = require('angular');

var ngModule = angular.module('developer.help', [
  require('./directive').name
]);

module.exports = ngModule;
