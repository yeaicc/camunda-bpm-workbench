package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.ProcessEngine;

import java.util.Collection;
import java.util.List;

/**
 * @author Daniel Meyer
 *
 */
public interface DebugSession {

  public void registerEventListener(DebugEventListener listener);

  public SuspendedExecution getNextSuspendedExecution() throws InterruptedException;

  public void addBreakPoint(BreakPoint breakPoint);

  public void removeBreakPoint(String id);

  public List<BreakPoint> getBreakPoints();

  public void setBreakpoints(Collection<BreakPoint> breakPoints);

  public ProcessEngine getProcessEngine();

  public String getProcessInstanceId();

  public void close();

  public void evaluateScript(String executionId, String language, String script, String cmdId);

  public void evaluateScript(String language, String script, String cmdId);

  public void resumeExecution(String id);

  public Script getScript(String processDefinitionId, String activityId);

  public void updateScript(String processDefinitionId, String activityId, Script script);

  public void completePartialInput(String prefix, String scopeId);

  public void stepExecution(String data);

}
