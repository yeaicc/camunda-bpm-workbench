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
package org.camunda.bpm.debugger.server.protocol;

import java.io.StringWriter;

import org.camunda.bpm.debugger.server.DebugWebsocketConfiguration;
import org.camunda.bpm.debugger.server.DebugWebsocketException;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Daniel Meyer
 *
 */
public class Marshaller {

  protected DebugWebsocketConfiguration configuration;

  public String marshal(Object object) {

    final ObjectMapper objectMapper = configuration.getObjectMapper();

    try {
      StringWriter valueWriter = new StringWriter();
      objectMapper.writeValue(valueWriter, object);

      return valueWriter.toString();

    } catch (Exception e) {
      throw new DebugWebsocketException("Error while marshalling to JSON ", e);
    }

  }

  public <T> T unmarshal(String source, Class<T> type) {

    final ObjectMapper objectMapper = configuration.getObjectMapper();

    try {
      return objectMapper.readValue(source, type);

    } catch (Exception e) {
      throw new DebugWebsocketException("Error while unmarshalling from JSON ", e);
    }

  }



  public void setConfiguration(DebugWebsocketConfiguration configuration) {
    this.configuration = configuration;
  }

}
