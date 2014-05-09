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
package org.camunda.bpm.engine.debugger.impl;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngineException;
import org.camunda.bpm.engine.debugger.BreakPoint;
import org.camunda.bpm.engine.debugger.DebugEventListener;
import org.camunda.bpm.engine.debugger.DebugSession;
import org.camunda.bpm.engine.debugger.DebuggerException;
import org.camunda.bpm.engine.debugger.SuspendedExecution;
import org.camunda.bpm.engine.impl.ProcessEngineImpl;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.scripting.ScriptingEngines;
import org.camunda.bpm.model.bpmn.Bpmn;

/**
 * @author Daniel Meyer
 *
 */
public class DebugSessionImpl implements DebugSession {

  protected Logger LOGG = Logger.getLogger(DebugSessionImpl.class.getName());

  /** the id of the process instance associated with this session, or null if no process instance is currently associated */
  protected String processInstanceId;

  protected DebugSessionFactoryImpl debugSessionFactory;

  protected List<BreakPoint> breakPoints = Collections.synchronizedList(new ArrayList<BreakPoint>());

  protected Deque<SuspendedExecutionImpl> suspendedExecutions = new ArrayDeque<SuspendedExecutionImpl>();

  protected List<DebugEventListener> debugEventListeners = new LinkedList<DebugEventListener>();

  protected Bindings globalScriptBindings;

  public DebugSessionImpl(DebugSessionFactoryImpl debugSessionFactory, BreakPoint[] breakPoints) {
    this.debugSessionFactory = debugSessionFactory;
    this.breakPoints.addAll(Arrays.asList(breakPoints));
    initBindings();
  }

  protected void initBindings() {
    globalScriptBindings = new SimpleBindings();
    ProcessEngine processEngine = debugSessionFactory.getProcessEngine();
    globalScriptBindings.put("processEngine", processEngine);
    globalScriptBindings.put("runtimeService", processEngine.getRuntimeService());
    globalScriptBindings.put("taskService", processEngine.getTaskService());
    globalScriptBindings.put("repositoryService", processEngine.getRepositoryService());
    globalScriptBindings.put("formService", processEngine.getFormService());
    globalScriptBindings.put("identityService", processEngine.getIdentityService());
    globalScriptBindings.put("authorizationService", processEngine.getAuthorizationService());
    globalScriptBindings.put("historyService", processEngine.getHistoryService());
    globalScriptBindings.put("Bpmn", Bpmn.INSTANCE);
  }

  public List<BreakPoint> getBreakPoints() {
    return new ArrayList<BreakPoint>(breakPoints);
  }

  public void suspend(SuspendedExecutionImpl suspendedExecution) {

    suspendedExecutions.push(suspendedExecution);

    try {

      synchronized (suspendedExecutions) {
        suspendedExecutions.notifyAll();
      }

      fireExecutionSuspended(suspendedExecution);

      synchronized (suspendedExecution) {
        while (!suspendedExecution.isResumed) {

          LOGG.info("[DEBUGGER] suspended " + suspendedExecution.getSuspendedThread().getName() + " on breakpoint " + suspendedExecution.getBreakPoint() + ".");

          // wait until we are notified
          suspendedExecution.wait();

          if(suspendedExecution.shouldEvaluateScript) {
            LOGG.info("[DEBUGGER] suspended " + suspendedExecution.getSuspendedThread().getName() + " on breakpoint evaluates script.");

            DebugScriptEvaluation scriptEvaluation = suspendedExecution.debugScriptEvaluation;

            try {
              Object result = Context.getProcessEngineConfiguration()
                .getScriptingEngines()
                .evaluate(scriptEvaluation.script, scriptEvaluation.language, suspendedExecution.executionEntity);

              scriptEvaluation.result = result;

              fireScriptEvaluated(scriptEvaluation);

            } catch(ProcessEngineException e) {
              LOGG.log(Level.WARNING, "[DEBUGGER] exception while evaluating script in Thread " +
                       suspendedExecution.getSuspendedThread().getName() + " at breakpoint " +
                       suspendedExecution.getBreakPoint() + ".", e);

              scriptEvaluation.setScriptException((ScriptException) e.getCause());
              fireScriptEvaluationFailed(scriptEvaluation);

            }
          }
        }
      }

      LOGG.info("[DEBUGGER] thread " + suspendedExecution.getSuspendedThread().getName() + " continues after breakpoint " + suspendedExecution.getBreakPoint() + ".");

    } catch (InterruptedException e) {
      LOGG.info("[DEBUGGER] thread " + suspendedExecution.getSuspendedThread().getName() + " interrupted at breakpoint " + suspendedExecution.getBreakPoint()  + ".");

    } finally {
      synchronized (suspendedExecutions) {
        suspendedExecutions.remove(suspendedExecution);
      }

    }
  }

  private void fireScriptEvaluationFailed(DebugScriptEvaluation scriptEvaluation) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onScriptEvaluationFailed(scriptEvaluation);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  protected void fireScriptEvaluated(DebugScriptEvaluation scriptEvaluation) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onScriptEvaluated(scriptEvaluation);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  private void fireExecutionSuspended(SuspendedExecutionImpl suspendedExecution) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onExecutionSuspended(suspendedExecution);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  public void registerEventListener(DebugEventListener listener) {
    debugEventListeners.add(listener);
  }

  public SuspendedExecution getNextSuspendedExecution() throws InterruptedException {
    synchronized (suspendedExecutions) {
      SuspendedExecutionImpl suspendedExecution = suspendedExecutions.peek();
      if(suspendedExecution == null) {
        suspendedExecutions.wait();
        suspendedExecution = suspendedExecutions.peek();
      }
      return suspendedExecution;
    }
  }

  public void addBreakPoint(BreakPoint breakPoint) {
    breakPoints.add(breakPoint);
  }

  public void setBreakpoints(Collection<BreakPoint> breakPoints) {
    this.breakPoints.clear();
    this.breakPoints.addAll(breakPoints);
  }

  public void removeBreakPoint(String id) {
    if(id == null) {
      throw new IllegalArgumentException("Id cannot be null.");
    }

    synchronized (breakPoints) {
      BreakPoint breakPointToRemove = null;
      for (BreakPoint breakPoint : breakPoints) {
        if(id.equals(breakPoint.getId())) {
          breakPointToRemove = breakPoint;
        }
      }
      if(breakPointToRemove != null) {
        breakPoints.remove(breakPointToRemove);
      }
    }

  }

  public ProcessEngine getProcessEngine() {
    return debugSessionFactory.getProcessEngine();
  }

  public void close() {
    debugSessionFactory.close(this);
  }

  public void evaluateScript(String executionId, String language, String script, String cmdId) {
    SuspendedExecutionImpl suspendedExecution = null;
    synchronized (suspendedExecutions) {
      for (SuspendedExecutionImpl execution : suspendedExecutions) {
        if(execution.getId().equals(executionId)) {
          suspendedExecution = execution;
        }
      }
    }
    if(suspendedExecution != null) {
      synchronized (suspendedExecution) {
        if(!suspendedExecution.isResumed) {
          suspendedExecution.evaluateScript(language, script, cmdId);
        }
      }
    } else {
      throw new DebuggerException("No suspended execution exists for Id '" + executionId + "'.");
    }
  }

  public String getProcessInstanceId() {
    return processInstanceId;
  }

  public void setProcessInstanceId(String processInstanceId) {
    this.processInstanceId = processInstanceId;
  }

  public void evaluateScript(String language, String script, String cmdId) {

    DebugScriptEvaluation scriptEvaluation = new DebugScriptEvaluation(language, script, cmdId);

    ProcessEngine processEngine = debugSessionFactory.getProcessEngine();
    ProcessEngineConfigurationImpl processEngineConfiguration = ((ProcessEngineImpl)processEngine).getProcessEngineConfiguration();

    ScriptingEngines scriptingEngines = processEngineConfiguration.getScriptingEngines();
    ScriptEngine scriptEngine = scriptingEngines.getScriptEngineForLanguage(language);
    if(scriptEngine == null) {
      scriptEvaluation.setResult("Could not find engine for language '"+language+"'");
      fireScriptEvaluationFailed(scriptEvaluation);
    } else {
      try {
        Object result = scriptEngine.eval(script, globalScriptBindings);
        scriptEvaluation.setResult(result);
        fireScriptEvaluated(scriptEvaluation);
      } catch (ScriptException e) {
        scriptEvaluation.setScriptException(e);
        fireScriptEvaluationFailed(scriptEvaluation);
      }
    }
  }
}
