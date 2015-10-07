package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.ProcessEngineException;

/**
 * @author Daniel Meyer
 *
 */
public class DebuggerException extends ProcessEngineException {

  private static final long serialVersionUID = 1L;

  public DebuggerException() {
    super();
  }

  public DebuggerException(String message, Throwable cause) {
    super(message, cause);
  }

  public DebuggerException(String message) {
    super(message);
  }

  public DebuggerException(Throwable cause) {
    super(cause);
  }

}
