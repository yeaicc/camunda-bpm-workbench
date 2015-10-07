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
  EventBus.prototype.onEvent =
  EventBus.prototype.on = function(eventName, callback, once) {
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
    var listeners = this.eventListeners[eventName];

    if (listeners === undefined) {
      return;
    }

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] == callback) {
        listeners.splice(i, 1);
        return;
      }
    }
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
        i--;
      }
    }
  }

  return EventBus;
})();

module.exports = EventBus;
