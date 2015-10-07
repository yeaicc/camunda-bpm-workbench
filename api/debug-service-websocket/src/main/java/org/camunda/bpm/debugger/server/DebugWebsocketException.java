package org.camunda.bpm.debugger.server;

/**
 * @author Daniel Meyer
 *
 */
public class DebugWebsocketException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public DebugWebsocketException() {
    super();
  }

  public DebugWebsocketException(String message, Throwable cause) {
    super(message, cause);
  }

  public DebugWebsocketException(String message) {
    super(message);
  }

  public DebugWebsocketException(Throwable cause) {
    super(cause);
  }

}
