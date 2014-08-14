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
package org.camunda.bpm.dev.debug.impl;

import org.camunda.bpm.dev.debug.*;
import org.camunda.bpm.dev.debug.completion.CodeCompleter;
import org.camunda.bpm.dev.debug.completion.CodeCompleterBuilder;
import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngineException;
import org.camunda.bpm.engine.impl.ProcessEngineImpl;
import org.camunda.bpm.engine.impl.bpmn.behavior.ScriptTaskActivityBehavior;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.camunda.bpm.engine.impl.pvm.delegate.ActivityBehavior;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;
import org.camunda.bpm.engine.impl.scripting.ExecutableScript;
import org.camunda.bpm.engine.impl.scripting.SourceExecutableScript;
import org.camunda.bpm.engine.impl.scripting.engine.ScriptingEngines;
import org.camunda.bpm.model.bpmn.Bpmn;

import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.script.SimpleBindings;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

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

    try {

      synchronized (suspendedExecutions) {
        suspendedExecutions.push(suspendedExecution);
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
              ExecutableScript executableScript = Context.getProcessEngineConfiguration()
                .getScriptFactory()
                .createScript(scriptEvaluation.script, scriptEvaluation.language);

              Object result = Context.getProcessEngineConfiguration()
                .getScriptingEnvironment()
                .execute(executableScript, suspendedExecution.executionEntity);

              scriptEvaluation.result = result;

              fireScriptEvaluated(scriptEvaluation);
              // fire execution update
              fireExecutionUpdated(suspendedExecution);

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

      fireExecutionUnsuspended(suspendedExecution);

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

  protected void fireExecutionSuspended(SuspendedExecutionImpl suspendedExecution) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onExecutionSuspended(suspendedExecution);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  protected void fireExecutionUnsuspended(SuspendedExecutionImpl suspendedExecution) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onExecutionUnsuspended(suspendedExecution);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  protected void fireExecutionUpdated(SuspendedExecutionImpl suspendedExecution) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onExecutionUpdated(suspendedExecution);
      } catch(Exception e) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", e);
      }
    }
  }

  protected void fireErrorOccured(Exception e, ExecutionEntity execution, AtomicOperation operation) {
    for (DebugEventListener eventListener : debugEventListeners) {
      try {
        eventListener.onException(e, execution, operation);
      } catch(Exception ex) {
        LOGG.log(Level.WARNING, "Exception while invoking debug event listener", ex);
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
    SuspendedExecutionImpl suspendedExecution = getSuspendedExecution(executionId);

    if(suspendedExecution != null) {
      synchronized (suspendedExecution) {
        if(!suspendedExecution.isResumed) {
          // evaluate script in suspended execution
          suspendedExecution.evaluateScript(language, script, cmdId);
        }
      }
    } else {
      throw new DebuggerException("No suspended execution exists for Id '" + executionId + "'.");
    }
  }

  protected SuspendedExecutionImpl getSuspendedExecution(String executionId) {
    SuspendedExecutionImpl suspendedExecution = null;
    synchronized (suspendedExecutions) {
      for (SuspendedExecutionImpl execution : suspendedExecutions) {
        if(execution.getId().equals(executionId)) {
          suspendedExecution = execution;
        }
      }
    }

    return suspendedExecution;
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

  public void resumeExecution(String id) {
    SuspendedExecutionImpl suspendedExecution = null;
    synchronized (suspendedExecutions) {
      for (SuspendedExecutionImpl execution : suspendedExecutions) {
        if(execution.getId().equals(id)) {
          suspendedExecution = execution;
        }
      }
    }
    if(suspendedExecution != null) {
      suspendedExecution.resume();
    }
  }

  public Script getScript(String processDefinitionId, String activityId) {
    ProcessDefinitionEntity processDefinition =
      (ProcessDefinitionEntity) getProcessEngine().getRepositoryService().getProcessDefinition(processDefinitionId);

    ActivityImpl activity = processDefinition.findActivity(activityId);

    ActivityBehavior activityBehavior = activity.getActivityBehavior();

    if (activityBehavior instanceof ScriptTaskActivityBehavior) {
      Script script = new Script();
      ExecutableScript taskScript = ((ScriptTaskActivityBehavior) activityBehavior).getScript();

      if (!(taskScript instanceof SourceExecutableScript)) {
        throw new DebuggerException("Encountered non-source script");
      }

      SourceExecutableScript sourceScript = (SourceExecutableScript) taskScript;

      script.setScript(sourceScript.getScriptSrc());
      script.setScriptingLanguage(sourceScript.getLanguage());

      return script;
    } else {
      throw new DebuggerException("Activity " + activityId + " is no script task");
    }
  }

  public void updateScript(String processDefinitionId, String activityId, Script script) {
    ProcessDefinitionEntity processDefinition =
      (ProcessDefinitionEntity) getProcessEngine().getRepositoryService().getProcessDefinition(processDefinitionId);

    ActivityImpl activity = processDefinition.findActivity(activityId);

    ActivityBehavior activityBehavior = activity.getActivityBehavior();

    if (activityBehavior instanceof ScriptTaskActivityBehavior) {
      SourceExecutableScript taskScript = (SourceExecutableScript) ((ScriptTaskActivityBehavior) activityBehavior).getScript();
      taskScript.setScriptSrc(script.getScript());
      // TODO set script language here
    } else {
      throw new DebuggerException("Activity " + activityId + " is no script task");
    }
  }

  public void execption(Exception e, ExecutionEntity execution, AtomicOperation executionOperation) {
    fireErrorOccured(e, execution, executionOperation);
  }

  public List<CodeCompletionHint> completePartialInput(String prefix, String scopeId) {
    CodeCompleter completer = new CodeCompleterBuilder().globalBindings(globalScriptBindings).buildCompleter();
    return completer.complete(prefix);
  }

}
