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

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

import java.net.InetSocketAddress;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.debugger.server.DebugServerConfiguration;

/**
 * The debug http server
 *
 * @author Daniel Meyer
 *
 */
public class DefaultNettyServer extends AbstractNettyServer {

  final static Logger LOGG = Logger.getLogger(DefaultNettyServer.class.getName());

  protected DebugServerConfiguration debugServerConfiguration;

  public DefaultNettyServer(int httpPort, DebugServerConfiguration debugServerConfiguration) {
    this.port = httpPort;
    this.debugServerConfiguration = debugServerConfiguration;
  }

  public ChannelFuture run() {

    final ServerBootstrap httpServerBootstrap = new ServerBootstrap();
    httpServerBootstrap.group(bossGroup, workerGroup)
      .channel(NioServerSocketChannel.class)
      .localAddress(new InetSocketAddress(port))
      .childHandler(new ChannelInitializer<SocketChannel>() {

        public void initChannel(final SocketChannel ch) throws Exception {
          ch.pipeline().addLast(
            new HttpResponseEncoder(),
            new HttpRequestDecoder(),
            new HttpObjectAggregator(65536),
            new WebSocketServerProtocolHandler("/debug-session"),
            new DebugProtocolHandler(debugServerConfiguration));
        }

    });

    LOGG.log(Level.INFO, "starting camunda BPM debug HTTP websocket interface on port "+port+".");

    return httpServerBootstrap.bind(port);


  }

}
