'use strict';

var fs = require('fs');

var directiveTemplate = fs.readFileSync(__dirname + '/dbgExecutions.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    template: directiveTemplate,
  };
};
