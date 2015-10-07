'use strict';

var WsConnection = (function() {

  /**
   * @class
   * @classdesc Wrapper for an underlying websocket connection
   *
   * The connection may be open and closed.
   */
  function WsConnection(serverUrl) {

    /**
     * @member {string} the url of the server to connect to */
    this.serverUrl = serverUrl;

    /**
     * @member {array} a list of listers which are invoked if 
     * a message is received on the websocket */
    this.listeners = [];

    /** 
     * @member {WebSocket} the websocket. Null if no connection to 
     * the server is currently open. */
    this.ws = null;

  }

  /**
   * Opens the connection
   *
   */
  WsConnection.prototype.open = function() {

    if(this.ws !== null) {
      this.close();
    }

    // open websocket conneciton
    this.ws = new WebSocket(this.serverUrl);

    var listeners = this.listeners;
    var self = this;

    this.ws.onopen = function() {
      handleMessage({data: '{"event" : "OPEN"}'}, listeners);
    };

    this.ws.onclose = function() {
      handleMessage({data: '{"event" : "CLOSE"}'}, listeners);
      self.ws = null;
    };

    this.ws.onmessage = function(msg) {
      handleMessage(msg, listeners);
    };

  };

  WsConnection.prototype.send = function(msg) {
    this.ws.send(msg);
  };

  /**
   * Closes the connection
   *
   */
  WsConnection.prototype.close = function() {

    this.ws.close();

  };

  /**
   * Register message listener
   *
   * @param {function} the message listener to register
   */
  WsConnection.prototype.onMessage = function(listener) {

    this.listeners.unshift(listener);

  };

  WsConnection.prototype.isOpen = function() {
    return this.ws !== null && this.ws.readyState == 1;
  };

  /**
   * Invoke listeners
   *
   */
  function handleMessage(msg, listeners) {
    for(var i=0; i < listeners.length; i++) {
      listeners[i](msg);
    }
  }

  return WsConnection;

})();

module.exports = WsConnection;
