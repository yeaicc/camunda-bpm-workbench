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

import java.util.Collection;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;

import org.camunda.bpm.dev.debug.BreakPoint;
import org.camunda.bpm.dev.debug.SuspendedExecution;
import org.camunda.bpm.engine.ProcessEngineServices;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.value.TypedValue;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.FlowElement;

/**
 * @author Daniel Meyer
 *
 */
public class SuspendedExecutionImpl implements SuspendedExecution {

  protected ExecutionEntity executionEntity;

  protected AtomicOperation operation;

  protected Thread suspendedThread;

  protected BreakPoint breakPoint;

  protected boolean isResumed;
  protected volatile boolean isStep;

//  protected boolean shouldEvaluateScript;
//
//  protected DebugScriptEvaluation debugScriptEvaluation;

  protected Queue<DebugOperation> debugOperations;


  public SuspendedExecutionImpl(ExecutionEntity executionEntity, AtomicOperation operation) {
    this.executionEntity = executionEntity;
    this.operation = operation;
    this.suspendedThread = Thread.currentThread();
    this.debugOperations = new LinkedBlockingQueue<DebugOperation>();
  }

  public SuspendedExecutionImpl(ExecutionEntity executionEntity, AtomicOperation operation, BreakPoint breakPoint) {
    this(executionEntity, operation);
    this.breakPoint = breakPoint;
  }

  public ExecutionEntity getExecution() {
    return executionEntity;
  }

  public AtomicOperation getOperation() {
    return operation;
  }

  public Thread getSuspendedThread() {
    return suspendedThread;
  }

  public String getOperationType() {
    return operation.getCanonicalName();
  }

  public BreakPoint getBreakPoint() {
    return breakPoint;
  }

  public synchronized void resume() {
    isResumed = true;
    notifyAll();
  }

  public synchronized void step() {
    isResumed = true;
    isStep = true;
    notifyAll();
  }


  public Map<String, Object> getVariables() {
    return executionEntity.getVariables();
  }

  public Map<String, Object> getVariablesLocal() {
    return executionEntity.getVariablesLocal();
  }

  public Object getVariable(String variableName) {
    return executionEntity.getVariable(variableName);
  }

  public String getId() {
    return executionEntity.getId();
  }

  public ProcessEngineServices getProcessEngineServices() {
    return executionEntity.getProcessEngineServices();
  }

  public Object getVariableLocal(String variableName) {
    return executionEntity.getVariableLocal(variableName);
  }

  public Set<String> getVariableNames() {
    return executionEntity.getVariableNames();
  }

  public Set<String> getVariableNamesLocal() {
    return executionEntity.getVariableNamesLocal();
  }

  public String getProcessInstanceId() {
    return executionEntity.getProcessInstanceId();
  }

  public void setVariable(String variableName, Object value) {
    executionEntity.setVariable(variableName, value);
  }

  public void setVariableLocal(String variableName, Object value) {
    executionEntity.setVariableLocal(variableName, value);
  }

  public BpmnModelInstance getBpmnModelInstance() {
    return executionEntity.getBpmnModelInstance();
  }

  public String getEventName() {
    return executionEntity.getEventName();
  }

  public void setVariables(Map<String, ? extends Object> variables) {
    executionEntity.setVariables(variables);
  }

  public void setVariablesLocal(Map<String, ? extends Object> variables) {
    executionEntity.setVariablesLocal(variables);
  }

  public String getBusinessKey() {
    return executionEntity.getBusinessKey();
  }

  public boolean hasVariables() {
    return executionEntity.hasVariables();
  }

  public FlowElement getBpmnModelElementInstance() {
    return executionEntity.getBpmnModelElementInstance();
  }

  public boolean hasVariablesLocal() {
    return executionEntity.hasVariablesLocal();
  }

  public boolean hasVariable(String variableName) {
    return executionEntity.hasVariable(variableName);
  }

  public boolean hasVariableLocal(String variableName) {
    return executionEntity.hasVariableLocal(variableName);
  }

  public void removeVariable(String variableName) {
    executionEntity.removeVariable(variableName);
  }

  public void removeVariableLocal(String variableName) {
    executionEntity.removeVariableLocal(variableName);
  }



  public String getProcessBusinessKey() {
    return executionEntity.getProcessBusinessKey();
  }

  public void removeVariables(Collection<String> variableNames) {
    executionEntity.removeVariables(variableNames);
  }

  public String getProcessDefinitionId() {
    return executionEntity.getProcessDefinitionId();
  }

  public void removeVariablesLocal(Collection<String> variableNames) {
    executionEntity.removeVariablesLocal(variableNames);
  }

  public String getParentId() {
    return executionEntity.getParentId();
  }

  public String getCurrentActivityId() {
    return executionEntity.getCurrentActivityId();
  }

  public void removeVariables() {
    executionEntity.removeVariables();
  }

  public String getCurrentActivityName() {
    return executionEntity.getCurrentActivityName();
  }

  public String getActivityInstanceId() {
    return executionEntity.getActivityInstanceId();
  }

  public void removeVariablesLocal() {
    executionEntity.removeVariablesLocal();
  }

  public String getParentActivityInstanceId() {
    return executionEntity.getParentActivityInstanceId();
  }

  public String getCurrentTransitionId() {
    return executionEntity.getCurrentTransitionId();
  }

  public void addDebugOperation(DebugOperation debugOperation) {
    this.debugOperations.add(debugOperation);
    notifyAll();
  }

  public String getVariableScopeKey() {
    return executionEntity.getVariableScopeKey();
  }

  public VariableMap getVariablesTyped() {
    return executionEntity.getVariablesTyped();
  }

  public VariableMap getVariablesTyped(boolean deserializeValues) {
    return executionEntity.getVariablesTyped(deserializeValues);
  }

  public VariableMap getVariablesLocalTyped() {
    return executionEntity.getVariablesLocalTyped();
  }

  public VariableMap getVariablesLocalTyped(boolean deserializeValues) {
    return getVariablesLocalTyped(deserializeValues);
  }

  public <T extends TypedValue> T getVariableTyped(String variableName) {
    return executionEntity.getVariableTyped(variableName);
  }

  public <T extends TypedValue> T getVariableTyped(String variableName, boolean deserializeValue) {
    return executionEntity.getVariableTyped(variableName, deserializeValue);
  }

  public <T extends TypedValue> T getVariableLocalTyped(String variableName) {
    return executionEntity.getVariableLocalTyped(variableName);
  }

  public <T extends TypedValue> T getVariableLocalTyped(String variableName, boolean deserializeValue) {
    return executionEntity.getVariableLocalTyped(variableName, deserializeValue);
  }

}
