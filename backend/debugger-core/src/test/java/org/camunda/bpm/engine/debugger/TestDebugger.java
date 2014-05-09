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
package org.camunda.bpm.engine.debugger;

import org.camunda.bpm.engine.test.ProcessEngineTestCase;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;

import static org.camunda.bpm.engine.debugger.BreakPointSpecs.*;

/**
 * @author Daniel Meyer
 *
 */
public class TestDebugger extends ProcessEngineTestCase {

  protected String deploymentId;
  protected String processDefinitionId;

  public void testOpenSession() throws InterruptedException {

    DebugSessionFactory debugSessionFactory = DebugSessionFactory.getInstance();
    debugSessionFactory.setSuspend(true);

    Thread executionThread = new Thread(){
      public void run() {
        runtimeService.startProcessInstanceByKey("testProcess");
      }
    };
    executionThread.start();

    BreakPoint b1 = new BreakPoint(BEFORE_ACTIVITY, processDefinitionId, "serviceTask1");

    DebugSession session = debugSessionFactory.openSession(b1);

    SuspendedExecution suspendedExecution = session.getNextSuspendedExecution();

    assertEquals(b1, suspendedExecution.getBreakPoint());

    suspendedExecution.resume();

    executionThread.join();

    assertEquals(0, runtimeService.createExecutionQuery().count());

  }

  protected void tearDown() throws Exception {
    repositoryService.deleteDeployment(deploymentId, true);
  }

  protected void setUp() throws Exception {
    super.setUp();
    BpmnModelInstance modelInstance = Bpmn.createExecutableProcess()
      .id("testProcess")
      .startEvent()
      .serviceTask("serviceTask1")
        .camundaExpression("${true}")
      .endEvent()
      .done();

    deploymentId = repositoryService.createDeployment()
      .addModelInstance("testProcess.bpmn", modelInstance)
      .deploy()
      .getId();

    processDefinitionId = repositoryService.createProcessDefinitionQuery().processDefinitionKey("testProcess").singleResult().getId();
  }

}
