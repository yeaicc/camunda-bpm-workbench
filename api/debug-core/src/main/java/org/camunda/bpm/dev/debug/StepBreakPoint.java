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

import java.lang.ref.WeakReference;

import org.camunda.bpm.dev.debug.impl.DebugSessionImpl;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;


/**
 * @author Daniel Meyer
 *
 */
public class StepBreakPoint extends BreakPoint {

  protected WeakReference<DebugSessionImpl> session;

  public StepBreakPoint(BreakPointSpec breakPointSpec, DebugSessionImpl debugSession) {
    super(breakPointSpec, null, null, null);
    this.session = new WeakReference<DebugSessionImpl>(debugSession);
  }

  public boolean breakOnOperation(AtomicOperation operation, ExecutionEntity execution) {
    return breakPointSpec.breakOnOperation(operation);
  }

  public DebugSessionImpl getSession() {
    return session.get();
  }

}
