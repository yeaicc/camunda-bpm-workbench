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

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.script.ScriptException;

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

  protected ScriptException scriptException;

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

  public void setScriptException(ScriptException scriptException) {
    this.scriptException = scriptException;
  }

  public ScriptException getScriptException() {
    return scriptException;
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

      this.setScriptException((ScriptException) e.getCause());
      debugSession.fireScriptEvaluationFailed(this);

    }

  }

}
