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

import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

import static org.camunda.bpm.engine.impl.pvm.runtime.operation.PvmAtomicOperation.*;

/**
 * @author Daniel Meyer
 *
 */
public enum BreakPointSpecs implements BreakPointSpec {

  /**
   * Breakpoint before an activity
   */
  BEFORE_ACTIVITY(PROCESS_START_INITIAL, ACTIVITY_START, TRANSITION_CREATE_SCOPE),

  /**
   * Breakpoint after an activity
   */
  AFTER_ACTIVITY(ACTIVITY_END, TRANSITION_DESTROY_SCOPE),

  /**
   * Breakpoint while taking a transition
   */
  AT_TRANSITION(TRANSITION_NOTIFY_LISTENER_TAKE);

  // implementation ////////////////////////////////

  private BreakPointSpecs(AtomicOperation... operations) {
    this.operations = operations;
  }

  /**
   * the set of operations to break on
   */
  protected AtomicOperation[] operations;

  /**
   * return true if the breakpoint should suspend on the activity
   */
  public boolean breakOnOperation(AtomicOperation op) {
    for (AtomicOperation operation : operations) {
      if(operation.equals(op)) {
        return true;
      }
    }
    return false;
  }

}
