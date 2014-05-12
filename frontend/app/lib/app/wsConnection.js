/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var WsConnection = (function() {

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

    // open websocket conneciton
    this.ws = new WebSocket(this.serverUrl);

    var listeners = this.listeners;

    this.ws.onopen = function() {
      handleMessage({data: '{"event" : "OPEN"}'}, listeners);
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
    this.ws = null;

  };

  /**
   * Register message listener
   *
   * @param {function} the message listener to register
   */
  WsConnection.prototype.onMessage = function(listener) {

    this.listeners.unshift(listener);

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
