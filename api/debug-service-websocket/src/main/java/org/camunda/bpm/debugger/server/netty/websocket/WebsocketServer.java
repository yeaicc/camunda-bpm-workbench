package org.camunda.bpm.debugger.server.netty.websocket;

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

import org.camunda.bpm.debugger.server.DebugWebsocketConfiguration;
import org.camunda.bpm.debugger.server.netty.AbstractNettyServer;

/**
 * The debug http server
 *
 * @author Daniel Meyer
 *
 */
public class WebsocketServer extends AbstractNettyServer {

  final static Logger LOGG = Logger.getLogger(WebsocketServer.class.getName());

  protected DebugWebsocketConfiguration debugWebsocketConfiguration;

  public WebsocketServer(int httpPort, DebugWebsocketConfiguration debugWebsocketConfiguration) {
    this.port = httpPort;
    this.debugWebsocketConfiguration = debugWebsocketConfiguration;
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
            new DebugProtocolHandler(debugWebsocketConfiguration));
        }

    });

    LOGG.log(Level.INFO, "starting camunda BPM debug HTTP websocket interface on port "+port+".");

    return httpServerBootstrap.bind(port);


  }

}
