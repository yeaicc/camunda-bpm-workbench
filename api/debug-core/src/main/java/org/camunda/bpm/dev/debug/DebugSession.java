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
