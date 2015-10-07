'use strict';

var fs = require('fs');

var directiveTemplate = fs.readFileSync(__dirname + '/dbgVariables.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    template: directiveTemplate,
  };
};
