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
package org.camunda.bpm.debugger.server.protocol.cmd;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

import org.camunda.bpm.debugger.server.netty.ChannelAttributes;
import org.camunda.bpm.debugger.server.protocol.DebugProtocol;
import org.camunda.bpm.debugger.server.protocol.evt.EventDto;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.engine.ProcessEngine;

import io.netty.channel.Channel;

/**
 * @author Daniel Meyer
 *
 */
public class DebugCommandContext {

  protected Channel channel;
  protected DebugProtocol protocol;

  public DebugCommandContext(Channel channel, DebugProtocol protocol) {
    this.channel = channel;
    this.protocol = protocol;
  }

  protected String getProcessDefinitionId() {
    return ChannelAttributes.getProcessDefinitionId(channel);
  }

  public void fireEvent(EventDto<?> event) {
    protocol.fireEvent(channel, event);
  }

  public ProcessEngine getProcessEngine() {
    return getDebugSession().getProcessEngine();
  }

  protected DebugSession getDebugSession() {
    return ChannelAttributes.getDebugSession(channel);
  }

  public <V> Future<V> executeAsync(Callable<V> callable) {
    FutureTask<V> task = new FutureTask<V>(callable);
    Thread thread = new Thread(task);
    thread.start();
    return task;
  }

}
