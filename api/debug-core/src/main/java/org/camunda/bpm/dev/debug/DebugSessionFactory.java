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

import java.util.List;

import org.camunda.bpm.dev.debug.impl.DebugSessionFactoryImpl;
import org.camunda.bpm.engine.ProcessEngine;

/**
 * @author Daniel Meyer
 *
 */
public abstract class DebugSessionFactory {

  private static DebugSessionFactory instance = new DebugSessionFactoryImpl();

  public static DebugSessionFactory getInstance() {
    return instance;
  }

  public abstract List<DebugSession> getSessions();

  /**
   * Open a {@link DebugSession} on the {@link ProcessEngine} provided
   * for this {@link DebugSessionFactory}.
   * @return a new debug session.
   */
  public abstract DebugSession openSession(BreakPoint... breakpoints);

  public abstract void setSuspend(boolean suspend);

  public abstract boolean isSuspend();

  public abstract void setProcessEngine(ProcessEngine processEngine);


}
