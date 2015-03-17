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
package org.camunda.bpm.debugger.server.protocol.dto;

import java.util.ArrayList;
import java.util.List;
import org.camunda.bpm.dev.debug.SuspendedExecution;
import org.camunda.bpm.engine.variable.VariableMap;

/**
 * @author Daniel Meyer
 *
 */
public class SuspendedExecutionData {

  protected String id;

  protected String activityInstanceId;

  protected String currentActivityId;

  protected String breakPointType;

  protected String operationType;

  protected String currentTransitionId;

  protected List<VariableInstanceDto> variables;

  public SuspendedExecutionData(SuspendedExecution suspendedExecution) {
    id = suspendedExecution.getId();
    activityInstanceId = suspendedExecution.getActivityInstanceId();
    currentActivityId = suspendedExecution.getCurrentActivityId();
    operationType = suspendedExecution.getOperationType();
    currentTransitionId = suspendedExecution.getCurrentTransitionId();
    breakPointType = suspendedExecution.getBreakPoint().getBreakPointSpec().toString();
    variables = new ArrayList<VariableInstanceDto>();
    VariableMap variables = suspendedExecution.getVariablesTyped();
    for (String name : variables.keySet()) {
      this.variables.add(new VariableInstanceDto(name, variables.getValueTyped(name)));
    }
  }

  public String getId() {
    return id;
  }

  public String getActivityInstanceId() {
    return activityInstanceId;
  }

  public String getCurrentActivityId() {
    return currentActivityId;
  }

  public String getOperationType() {
    return operationType;
  }

  public String getCurrentTransitionId() {
    return currentTransitionId;
  }

  public List<VariableInstanceDto> getVariables() {
    return variables;
  }

  public String getBreakPointType() {
    return breakPointType;
  }

}
