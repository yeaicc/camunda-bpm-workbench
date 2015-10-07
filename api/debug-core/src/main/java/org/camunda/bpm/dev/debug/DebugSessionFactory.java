package org.camunda.bpm.dev.debug;

import java.util.List;

import org.camunda.bpm.dev.debug.impl.DebugSessionFactoryImpl;
import org.camunda.bpm.engine.ProcessEngine;

/**
 * @author Daniel Meyer
 *
 */
public abstract class DebugSessionFactory {

  private static DebugSessionFactory instance = new DebugSessionFactoryImpl();

  public static DebugSessionFactory getInstance() {
    return instance;
  }

  public abstract List<DebugSession> getSessions();

  /**
   * Open a {@link DebugSession} on the {@link ProcessEngine} provided
   * for this {@link DebugSessionFactory}.
   * @return a new debug session.
   */
  public abstract DebugSession openSession(BreakPoint... breakpoints);

  public abstract void setSuspend(boolean suspend);

  public abstract boolean isSuspend();

  public abstract void setProcessEngine(ProcessEngine processEngine);


}
