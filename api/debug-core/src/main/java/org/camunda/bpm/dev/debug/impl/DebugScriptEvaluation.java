package org.camunda.bpm.dev.debug.impl;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.ProcessEngineException;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.scripting.ExecutableScript;

/**
 * @author Daniel Meyer
 *
 */
public class DebugScriptEvaluation implements DebugOperation {

  protected Logger LOGG = Logger.getLogger(DebugScriptEvaluation.class.getName());

  protected String language;

  protected String script;

  protected Object result;

  protected Exception exception;

  protected String cmdId;

  public DebugScriptEvaluation(String language, String script, String cmdId) {
    this.language = language;
    this.script = script;
    this.cmdId = cmdId;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getScript() {
    return script;
  }

  public void setScript(String script) {
    this.script = script;
  }

  public Object getResult() {
    return result;
  }

  public void setResult(Object result) {
    this.result = result;
  }

  public void setException(Exception scriptException) {
    this.exception = scriptException;
  }

  public Exception getException() {
    return exception;
  }

  public String getCmdId() {
    return cmdId;
  }

  public void execute(DebugSessionImpl debugSession, SuspendedExecutionImpl suspendedExecution) {
    LOGG.info("[DEBUGGER] suspended " + suspendedExecution.getSuspendedThread().getName() + " on breakpoint evaluates script.");

    try {
      ExecutableScript executableScript = Context.getProcessEngineConfiguration()
        .getScriptFactory()
        .createScriptFromSource(language, script);

      Object result = Context.getProcessEngineConfiguration()
        .getScriptingEnvironment()
        .execute(executableScript, suspendedExecution.executionEntity);

      this.result = result;

      debugSession.fireScriptEvaluated(this);
      // fire execution update
      debugSession.fireExecutionUpdated(suspendedExecution);

    } catch(ProcessEngineException e) {
      LOGG.log(Level.WARNING, "[DEBUGGER] exception while evaluating script in Thread " +
               suspendedExecution.getSuspendedThread().getName() + " at breakpoint " +
               suspendedExecution.getBreakPoint() + ".", e);

      this.setException((Exception) e.getCause());
      debugSession.fireScriptEvaluationFailed(this);

    }

  }

}
