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
