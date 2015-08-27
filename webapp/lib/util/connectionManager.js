'use strict';

var ConnectionManager = (function() {

  /**
   * @class
   * @classdesc Manager to configure list of connections to servers (WS or REST)
   */
  function ConnectionManager(defaultUrl) {

    this.servers = [];

    // load from local storage

    if (defaultUrl) {
      this.servers.push( 
          {
            'name': 'Default',
            'url': defaultUrl,
            'webSocket': true,
            'default': true
          }
      );
    }

    // TODO: make this configurable
    this.servers.push( 
          {
            'name': 'Local WildFly',
            'url': 'http://localhost:8080/engine-rest/engine/default',
            'webSocket': false,
            'default': false
          }
    );
    this.servers.push( 
          {
            'name': 'Process Engine Remote Port',
            'url': 'ws://localhost:8090/debug-session',
            'webSocket': true,
            'default': false
          }
    );      
  }

  ConnectionManager.prototype.addServer = function(name, url, userName, password) {
    var server = {
      'name': name,
      'url': url,
      'webSocket': (url.substring(0, 2) == 'ws')
    };
    if (userName) {
      server.userName = userName;
      server.password = password;
    }
    this.servers.push(server);

    // store to local storage
  };

  ConnectionManager.prototype.getDefaultServer = function() {
    for (var i = 0; i < this.servers.length; i++) {
      var server = this.servers[i];
      if (server.default) {
        return server;
      }
    }
    return null;
  }; 

  ConnectionManager.prototype.getServerList = function(debugOnly) {
    if (!debugOnly) {
      // all servers
      return this.servers;
    }

    var result = [];
    // filter only web socket ones, only they can be used for debugging
    for (var i = 0; i < this.servers.length; i++) {
      var server = this.servers[i];
      if (server.webSocket) {
        result.push(server);
      }
    }
    return result;
  }; 

  return ConnectionManager;
})();

module.exports = ConnectionManager;