package org.camunda.bpm.dev.debug.completion;

import org.camunda.bpm.engine.impl.RuntimeServiceImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.script.Bindings;
import javax.script.SimpleBindings;
import java.util.List;

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
    List<CodeCompletionHint> hints = completer.complete("runtimeService.createMessageCorrelation('aMessage').setV");
    Assert.assertEquals(2, hints.size());
  }
}
