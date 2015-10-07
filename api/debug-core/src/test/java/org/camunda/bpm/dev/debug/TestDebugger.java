package org.camunda.bpm.dev.debug;

import org.camunda.bpm.dev.debug.BreakPoint;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.dev.debug.SuspendedExecution;
import org.camunda.bpm.engine.test.ProcessEngineTestCase;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;

import static org.camunda.bpm.dev.debug.BreakPointSpecs.*;

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

    BreakPoint b1 = new BreakPoint(BEFORE_ACTIVITY, processDefinitionId, "serviceTask1", null);

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
