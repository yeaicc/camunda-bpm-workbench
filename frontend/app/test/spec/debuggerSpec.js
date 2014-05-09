var ProcessDebugger = require('../../ProcessDebugger');


describe('debugger', function() {


  it('should bootstrap', function() {

    var connection = jasmine.spyOn({}, 'connection');

    var processDebugger = new ProcessDebugger({}, connection);

    expect(connection.connect).toBeCalledWith('sdda');
  });

});