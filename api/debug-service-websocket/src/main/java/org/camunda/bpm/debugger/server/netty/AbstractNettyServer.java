package org.camunda.bpm.debugger.server.netty;

import io.netty.channel.ChannelFuture;
import io.netty.channel.nio.NioEventLoopGroup;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Daniel Meyer
 *
 */
public abstract class AbstractNettyServer {

  private final static Logger LOGG = Logger.getLogger(Logger.class.getName());

  protected int port;
  protected NioEventLoopGroup bossGroup = new NioEventLoopGroup();
  protected NioEventLoopGroup workerGroup = new NioEventLoopGroup();

  public abstract ChannelFuture run();

  public void shutdown() {
    try {
      bossGroup.shutdownGracefully().sync();
      workerGroup.shutdownGracefully().sync();
    } catch (InterruptedException e) {
      LOGG.log(Level.WARNING, "interrutped while waiting for shutdown", e);
    }
  }

}