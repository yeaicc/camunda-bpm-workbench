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

var EventBus = (function() {

  /**
   * @class
   * @classdesc a very simple event bus
   *
   */
  function EventBus() {

    /**
     * @member {array} a list of event liseners on the debug session
     */
    this.eventListeners = {};

  }

  /**
   * Register an event listener for a particular event or all events.
   *
   * @param {string} eventName the name of the event or '*' for global event listeners
   * @param {function} callback the callback function invoked if an event is received.
   */
  EventBus.prototype.onEvent = function(eventName, callback, once) {
    if(once) {
      callback.once = true;
    }
    var listeners = this.eventListeners;
    if(listeners[eventName] === undefined) {
      listeners[eventName] = [];
    }
    listeners[eventName].unshift(callback);
  };

  EventBus.prototype.off = function(eventName, callback) {
    console.warn('not implemented EventBus#off', eventName, callback);
  };

  EventBus.prototype.fireEvent = function(eventName, eventPayload) {
    fireEvent(eventName, eventPayload, this.eventListeners);
  };

  function fireEvent(eventName, eventPayload, eventListeners) {

    // (1) invoke scoped listeners
    var listeners = eventListeners[eventName];
    if(!!listeners && listeners.length > 0) {
      notifyListeners(listeners, eventPayload);
    }

    // (2) invoke global listeners
    listeners = eventListeners['*'];
    if(!!listeners && listeners.length > 0) {
      notifyListeners(listeners, eventPayload);
    }
  }

  function notifyListeners(listeners, eventObject) {
    for(var i = 0; i < listeners.length; i++) {
      listeners[i](eventObject);
      if(listeners[i].once) {
        listeners.shift(i,1);
      }
    }
  }

  return EventBus;
})();

module.exports = EventBus;
