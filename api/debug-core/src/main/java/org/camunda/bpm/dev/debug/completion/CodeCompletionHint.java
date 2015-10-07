package org.camunda.bpm.dev.debug.completion;

public class CodeCompletionHint {

  protected String completedIdentifier;
  protected String completedMethod;
  protected String completedType;

  public String getCompletedIdentifier() {
    return completedIdentifier;
  }
  public void setCompletedIdentifier(String completedIdentifier) {
    this.completedIdentifier = completedIdentifier;
  }
  public String getCompletedType() {
    return completedType;
  }
  public void setCompletedType(String completedType) {
    this.completedType = completedType;
  }
  public String getCompletedMethod() {
    return completedMethod;
  }
  public void setCompletedMethod(String completedMethod) {
    this.completedMethod = completedMethod;
  }
  public String toString() {
    return completedIdentifier + ": " + completedType;
  }

}
