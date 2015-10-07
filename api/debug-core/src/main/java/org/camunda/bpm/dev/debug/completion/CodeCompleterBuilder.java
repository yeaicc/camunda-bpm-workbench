package org.camunda.bpm.dev.debug.completion;

import java.util.HashSet;
import java.util.Set;

import javax.script.Bindings;

public class CodeCompleterBuilder {

  protected Set<Bindings> bindings;

  public CodeCompleterBuilder() {
    this.bindings = new HashSet<Bindings>();
  }

  public CodeCompleterBuilder bindings(Bindings bindings) {
    this.bindings.add(bindings);
    return this;
  }

  // TODO allow to set language-specific prefix splitter here if that is cool

  public CodeCompleter buildCompleter() {
    CodeCompleter completer = new CodeCompleter();

    if (bindings != null) {
      completer.setVariableBindings(bindings);
    }

    return completer;
  }
}
