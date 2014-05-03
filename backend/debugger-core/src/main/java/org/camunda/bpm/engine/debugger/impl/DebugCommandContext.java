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

import java.util.List;

import org.camunda.bpm.engine.debugger.BreakPoint;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.interceptor.Command;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;
import org.camunda.bpm.engine.impl.pvm.runtime.InterpretableExecution;

/**
 * @author Daniel Meyer
 *
 */
public class DebugCommandContext extends CommandContext {

  protected DebugSessionFactoryImpl debugSessionFactory;

  public DebugCommandContext(Command<?> command, ProcessEngineConfigurationImpl processEngineConfiguration, DebugSessionFactoryImpl debugSessionFactory) {
    super(command, processEngineConfiguration);
    this.debugSessionFactory = debugSessionFactory;
  }

  public void performOperation(AtomicOperation executionOperation, InterpretableExecution execution) {
    final DebugSessionImpl currentSession = debugSessionFactory.getCurrentSession();
    final ExecutionEntity executionEntity = (ExecutionEntity) execution;

    if(currentSession == null) {
      if(debugSessionFactory.isSuspend()) {
        debugSessionFactory.waitForOpenSession(new SuspendedExecutionImpl(executionEntity, executionOperation));
      }
    } else {
      List<BreakPoint> breakPoints = currentSession.getBreakPoints();
      for (BreakPoint breakPoint : breakPoints) {
        if(breakPoint.breakOnOperation(executionOperation, executionEntity)) {
          currentSession.suspend(new SuspendedExecutionImpl(executionEntity, executionOperation, breakPoint));
        }
      }

    }

    super.performOperation(executionOperation, executionEntity);
  }


}
