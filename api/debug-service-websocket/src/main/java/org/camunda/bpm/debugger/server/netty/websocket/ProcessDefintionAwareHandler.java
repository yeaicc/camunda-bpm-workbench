package org.camunda.bpm.debugger.server.netty.websocket;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpRequest;

/**
 * @author Daniel Meyer
 *
 */
public class ProcessDefintionAwareHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

  protected static Pattern processDefinitionIdPattern = Pattern.compile(".*/([^/]+)/debug-session");

  protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest msg) throws Exception {

    String uri = msg.getUri();

    Matcher matcher = processDefinitionIdPattern.matcher(uri);

    if(matcher.matches()) {
      String processDefinitionId = matcher.group(1);
      ChannelAttributes.setProcessDefinitionId(ctx.channel(), processDefinitionId);
    }

  }



}
