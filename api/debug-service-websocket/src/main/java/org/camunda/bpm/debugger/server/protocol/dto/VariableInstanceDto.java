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
package org.camunda.bpm.debugger.server.protocol.dto;

import java.util.Map;

import org.camunda.bpm.engine.variable.value.SerializableValue;
import org.camunda.bpm.engine.variable.value.TypedValue;

/**
 * @author Daniel Meyer
 *
 */
public class VariableInstanceDto {

  protected String variableName;
  protected Object variableValue;
  protected String type;
  protected Map<String, Object> valueInfo;

  public VariableInstanceDto(String name, TypedValue typedValue) {
    variableName = name;
    type = typedValue.getType().getName();
    valueInfo = typedValue.getType().getValueInfo(typedValue);
    if (typedValue instanceof SerializableValue) {
      SerializableValue serializableValue = (SerializableValue) typedValue;
      this.variableValue = serializableValue.getValueSerialized();
    }
    else {
      this.variableValue = typedValue.getValue();
    }
  }

  public String getVariableName() {
    return variableName;
  }

  public Object getVariableValue() {
    return variableValue;
  }

  public Map<String, Object> getValueInfo() {
    return valueInfo;
  }

  public String getType() {
    return type;
  }

}
