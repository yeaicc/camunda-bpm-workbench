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
package org.camunda.bpm.debugger.server.netty;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

import org.camunda.bpm.engine.debugger.DebugEventListener;
import org.camunda.bpm.engine.debugger.DebugSession;

/**
 * @author Daniel Meyer
 *
 */
public class ChannelAttributes {

  protected static final AttributeKey<String> PROCESS_DEF_ID_ATTR = AttributeKey.valueOf("processDefinitionId");
  protected static final AttributeKey<DebugEventListener> DBG_EVT_LISTENER_ATTR = AttributeKey.valueOf("debugEventListener");
  protected static final AttributeKey<DebugSession> DBG_SESSION_ATTR = AttributeKey.valueOf("debugSession");

  public static String getProcessDefinitionId(Channel channel) {
    return channel.attr(PROCESS_DEF_ID_ATTR).get();
  }

  public static void setProcessDefinitionId(Channel channel, String value) {
    channel.attr(PROCESS_DEF_ID_ATTR).set(value);
  }

  public static DebugEventListener getDebugEventListener(Channel channel) {
    return channel.attr(DBG_EVT_LISTENER_ATTR).get();
  }

  public static void setDebugEventListener(Channel channel, DebugEventListener debugEventListener) {
    channel.attr(DBG_EVT_LISTENER_ATTR).set(debugEventListener);
  }

  public static DebugSession getDebugSession(Channel channel) {
    return channel.attr(DBG_SESSION_ATTR).get();
  }

  public static void setDebugSession(Channel channel, DebugSession session) {
    channel.attr(DBG_SESSION_ATTR).set(session);
  }

}
