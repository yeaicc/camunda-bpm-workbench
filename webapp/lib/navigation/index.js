var angular = require('angular');

var ngModule = angular.module('developer.navigation', [
  require('./navPerspectiveSwitcher').name
]);

module.exports = ngModule;

