package org.camunda.bpm.dev.debug.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.camunda.bpm.dev.debug.BreakPoint;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.engine.ProcessEngine;

/**
 * @author Daniel Meyer
 *
 */
public class DebugSessionFactoryImpl extends DebugSessionFactory {

  protected Logger LOGG = Logger.getLogger(DebugSessionFactoryImpl.class.getName());

  protected boolean isSuspend;

  protected List<DebugSessionImpl> sessions = new ArrayList<DebugSessionImpl>();

  protected List<SuspendedExecutionImpl> suspendedExecutionImpls = new ArrayList<SuspendedExecutionImpl>();

  protected ProcessEngine processEngine;

  public synchronized DebugSession openSession(BreakPoint... breakPoints) {
    DebugSessionImpl  newSession = new DebugSessionImpl(this, breakPoints);

    LOGG.info("[DEBUGGER] "+Thread.currentThread().getName()+" opens new debug session.");

    boolean isFirstSession = sessions.isEmpty();

    sessions.add(newSession);

    if(isFirstSession) {
      notifyAll();
    }

    return newSession;
  }

  public void setSuspend(boolean suspend) {
    isSuspend = suspend;
  }

  public boolean isSuspend() {
    return isSuspend;
  }

  public List<DebugSession> getSessions() {
    return new ArrayList<DebugSession>(sessions);
  }

  /**
   * Ads the {@link SuspendedExecutionImpl} to the list of suspended executions.
   *
   * This method will be invoked by the thread to be suspended.
   *
   * @param suspendedExecutionImpl
   */
  public synchronized void waitForOpenSession(SuspendedExecutionImpl suspendedExecutionImpl) {
    // re-check whether no session exists. This is synchronized with the
    // openSession method.
    if(sessions.isEmpty()) {
      suspendedExecutionImpls.add(suspendedExecutionImpl);
      try {
        LOGG.info("[DEBUGGER] "+ suspendedExecutionImpl.getSuspendedThread().getName() + " waiting for a debug session to be opened.");
        wait();
        LOGG.info("[DEBUGGER] "+ suspendedExecutionImpl.getSuspendedThread().getName() + " continuing execution.");

      } catch (InterruptedException e) {
        LOGG.info("[DEBUGGER] "+ suspendedExecutionImpl.getSuspendedThread().getName() + " interrupted while waiting for openSession().");

      } finally {
        suspendedExecutionImpls.remove(suspendedExecutionImpl);

      }
    }
  }

  public void setProcessEngine(ProcessEngine processEngine) {
    this.processEngine = processEngine;
  }

  public ProcessEngine getProcessEngine() {
    return processEngine;
  }

  /**
   * @param session
   */
  public synchronized void close(DebugSessionImpl session) {

    sessions.remove(session);
    for (SuspendedExecutionImpl suspendedExecution : session.suspendedExecutions) {
      suspendedExecution.resume();
    }
    LOGG.info("[DEBUGGER] "+Thread.currentThread().getName()+" closed debug session.");
    
  }

}
