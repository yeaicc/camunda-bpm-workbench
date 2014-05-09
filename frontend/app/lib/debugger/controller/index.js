var angular = require('angular');

var ngModule = angular.module('developer.console.service', []);

ngModule.controller("ConsoleCtrl", require("./consoleController"));

module.exports = ngModule;
