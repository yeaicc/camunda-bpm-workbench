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
package org.camunda.bpm.debugger.server;

import io.netty.channel.ChannelFuture;

/**
 *
 * @author Daniel Meyer
 *
 */
public class DebugWebsocket {

  protected DebugWebsocketConfiguration debugWebsocketConfiguration;

  protected ChannelFuture closeFuture;

  /**
   * @param debugWebsocketConfiguration
   */
  public DebugWebsocket(DebugWebsocketConfiguration debugWebsocketConfiguration) {
    this.debugWebsocketConfiguration = debugWebsocketConfiguration;

    try {
      closeFuture = debugWebsocketConfiguration.getNettyServer().run()
        .sync()
        .channel()
        .closeFuture();

    } catch(Exception e) {
      throw new DebugWebsocketException("Exception while staring server", e);

    }

  }

  public void waitForShutdown() {
    try {
      closeFuture.sync();
    } catch (InterruptedException e) {
      // ignore
    }
  }

  public void shutdown() {
    debugWebsocketConfiguration.getNettyServer().shutdown();
  }

}
