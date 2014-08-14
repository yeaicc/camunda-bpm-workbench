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

import java.util.List;

import javax.script.Bindings;
import javax.script.SimpleBindings;

import org.camunda.bpm.engine.impl.RuntimeServiceImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class CodeCompleterTest {

  protected CodeCompleter completer;

  @Before
  public void setUp() {
    completer = new CodeCompleter();

    Bindings bindings = new SimpleBindings();
    bindings.put("runtimeService", new RuntimeServiceImpl());

    completer.addVariableBindings(bindings);
  }

  @Test
  public void testRootCompletion() {
    List<CodeCompletionHint> hints = completer.complete("runtim");
    Assert.assertEquals(1, hints.size());

    CodeCompletionHint hint = hints.get(0);
    Assert.assertEquals("runtimeService", hint.getCompletedIdentifier());
    Assert.assertEquals("RuntimeServiceImpl", hint.getCompletedType());
  }

  @Test
  public void testMethodCompletion() {
    List<CodeCompletionHint> hints = completer.complete("runtimeService.signalEventR");
    Assert.assertEquals(4, hints.size());
  }

  @Test
  public void testNestedMethodCompletion() {
    List<CodeCompletionHint> hints = completer.complete("runtimeService.getVariables().pu");
    Assert.assertEquals(3, hints.size());
  }
}
