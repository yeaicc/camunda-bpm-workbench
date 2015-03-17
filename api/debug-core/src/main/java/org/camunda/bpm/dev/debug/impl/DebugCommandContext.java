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

import org.camunda.bpm.dev.debug.BreakPoint;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.dev.debug.StepBreakPoint;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.delegate.ActivityExecution;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

import static org.camunda.bpm.dev.debug.BreakPointSpecs.*;

import java.util.List;

/**
 * @author Daniel Meyer
 *
 */
public class DebugCommandContext extends CommandContext {

  private static ThreadLocal<StepBreakPoint> NEXT_STEP_BREAK_POINT = new ThreadLocal<StepBreakPoint>();

  protected DebugSessionFactoryImpl debugSessionFactory;

  public DebugCommandContext(ProcessEngineConfigurationImpl processEngineConfiguration, DebugSessionFactoryImpl debugSessionFactory) {
    super(processEngineConfiguration);
    this.debugSessionFactory = debugSessionFactory;
  }

  public void performOperation(AtomicOperation executionOperation, ExecutionEntity execution) {
    List<DebugSession> openSessions = debugSessionFactory.getSessions();
    final ExecutionEntity executionEntity = (ExecutionEntity) execution;

    if(openSessions.isEmpty()) {
      if(debugSessionFactory.isSuspend()) {
        debugSessionFactory.waitForOpenSession(new SuspendedExecutionImpl(executionEntity, executionOperation));
      } else {
        super.performOperation(executionOperation, executionEntity);
        return;
      }
    }

    DebugSessionImpl currentSession = null;
    BreakPoint breakPoint = null;

    if(NEXT_STEP_BREAK_POINT.get() != null) {
      StepBreakPoint stepBreakPoint = NEXT_STEP_BREAK_POINT.get();
      if(stepBreakPoint.breakOnOperation(executionOperation, executionEntity)) {
        NEXT_STEP_BREAK_POINT.remove();
        breakPoint = stepBreakPoint;
        currentSession = stepBreakPoint.getSession();
      }
    }
    else {
      synchronized (DebugSessionFactory.getInstance()) {

        openSessions = debugSessionFactory.getSessions();
        for (DebugSession debugSession : openSessions) {
          if(execution.getProcessInstanceId().equals(debugSession.getProcessInstanceId())) {
            currentSession = (DebugSessionImpl) debugSession;

            try {
              breakPoint = findBreakPoint(debugSession, executionOperation, executionEntity);
            } catch (RuntimeException e) {
              currentSession.execption(e, execution, executionOperation);
              throw e;
            }

            break;

          } else if(debugSession.getProcessInstanceId() == null) {
            if(currentSession == null) {
              try {
                breakPoint = findBreakPoint(debugSession, executionOperation, execution);

              } catch (RuntimeException e) {
                ((DebugSessionImpl) debugSession).execption(e, execution, executionOperation);
                throw e;
              }

              if(breakPoint != null) {
                currentSession = (DebugSessionImpl) debugSession;
              }
            }
          }
        }
      }
    }

    boolean isSuspended = false;
    if(currentSession != null && breakPoint != null) {
      if(currentSession.getProcessInstanceId() == null) {
        currentSession.setProcessInstanceId(execution.getProcessInstanceId());
      }
      isSuspended = true;
      SuspendedExecutionImpl suspendedExecution = new SuspendedExecutionImpl((ExecutionEntity) execution, executionOperation, breakPoint);
      currentSession.suspend(suspendedExecution);
      if(suspendedExecution.isStep) {
        NEXT_STEP_BREAK_POINT.set(new StepBreakPoint(
            // TODO: currently sequence flows are not supported for stepping
            BEFORE_ACTIVITY.equals(breakPoint.getBreakPointSpec()) ? AFTER_ACTIVITY : BEFORE_ACTIVITY,
            currentSession));
      }
    }

    try {
      super.performOperation(executionOperation, execution);
      if(currentSession != null) {
        // check whether process instance is ended:
        ExecutionEntity processInstance = execution.getProcessInstance();
        if(processInstance.isEnded()) {
          // disconnect session from this process instance
          currentSession.setProcessInstanceId(null);
        }
      }
    } catch(RuntimeException e) {
      if(isSuspended) {
        // hand exception to debug session
        currentSession.execption(e, execution, executionOperation);
      }
      throw e;
    }
  }

  protected BreakPoint findBreakPoint(DebugSession debugSession, AtomicOperation executionOperation, ActivityExecution execution) {
    for (BreakPoint breakPoint : debugSession.getBreakPoints()) {
      if(breakPoint.breakOnOperation(executionOperation, (ExecutionEntity) execution)) {
        return breakPoint;
      }
    }
    return null;
  }

}
