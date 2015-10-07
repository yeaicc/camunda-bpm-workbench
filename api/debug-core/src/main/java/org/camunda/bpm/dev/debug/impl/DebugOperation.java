package org.camunda.bpm.dev.debug.impl;


public interface DebugOperation {

  void execute(DebugSessionImpl debugSession, SuspendedExecutionImpl suspendedExecution);
}
