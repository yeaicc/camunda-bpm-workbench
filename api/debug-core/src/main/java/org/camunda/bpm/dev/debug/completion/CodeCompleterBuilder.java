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
package org.camunda.bpm.dev.debug.completion;

import javax.script.Bindings;

public class CodeCompleterBuilder {

  protected Bindings globalBindings;

  public CodeCompleterBuilder globalBindings(Bindings globalBindings) {
    this.globalBindings = globalBindings;
    return this;
  }

  // TODO allow to set language-specific prefix splitter here if that is cool

  public CodeCompleter buildCompleter() {
    CodeCompleter completer = new CodeCompleter();

    if (globalBindings != null) {
      completer.addBindings(globalBindings);
    }

    return completer;
  }
}
