'use strict';

describe('environment', function() {


  it('should provide bpmn-js', function() {

    var bpmnJS = require('bpmn-js');

    expect(bpmnJS).toBeDefined();
  });

});