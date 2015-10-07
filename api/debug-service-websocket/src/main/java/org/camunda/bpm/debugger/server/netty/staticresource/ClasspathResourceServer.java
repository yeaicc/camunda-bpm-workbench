package org.camunda.bpm.debugger.server.netty.staticresource;

import org.camunda.bpm.debugger.server.netty.AbstractNettyServer;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.socket.nio.NioServerSocketChannel;

/**
 * @author Daniel Meyer
 *
 */
public class ClasspathResourceServer extends AbstractNettyServer {

  private int port;

  public ClasspathResourceServer(int port) {
    this.port = port;
  }

  public ChannelFuture run() {
    ServerBootstrap b = new ServerBootstrap();
    b.group(bossGroup, workerGroup)
     .channel(NioServerSocketChannel.class)
     .childHandler(new HttpClasspathResourceServerInitializer());

    return b.bind(port);
  }

}
