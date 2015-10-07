package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.delegate.DelegateExecution;

/**
 * @author Daniel Meyer
 *
 */
public interface SuspendedExecution extends DelegateExecution {

  /**
   * @return the {@link BreakPoint} on which this execution was suspended.
   */
  public BreakPoint getBreakPoint();

  /**
   * Release the suspended thread and resume execution.
   */
  public void resume();

  public String getOperationType();

}
