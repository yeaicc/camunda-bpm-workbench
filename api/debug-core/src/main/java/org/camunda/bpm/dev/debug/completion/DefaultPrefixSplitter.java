package org.camunda.bpm.dev.debug.completion;

import org.camunda.bpm.dev.debug.DebuggerException;


public class DefaultPrefixSplitter implements PrefixSplitter {

  public String[] split(String prefix) {
    return prefix.split("\\.");
  }

  public int lastSplit(String path) {
    return path.lastIndexOf(".");
  }

  public String[] extractMethodArgs(String methodInvocation) {
    int openParenthesis = methodInvocation.indexOf("(");
    if (openParenthesis == -1) {
      return new String[]{};
    } else {
      int closingParenthesis = methodInvocation.indexOf(")");
      if (closingParenthesis == -1) {
        throw new DebuggerException("malformed method invocation: " + methodInvocation);
      }

      String args = methodInvocation.substring(openParenthesis, closingParenthesis - 1);
      if (args.trim().isEmpty()) {
        return new String[]{};
      }

      return methodInvocation.substring(openParenthesis, closingParenthesis - 1).split(",");
    }
  }

  public String extractMethodName(String methodInvocation) {
    int openParenthesis = methodInvocation.indexOf("(");
    if (openParenthesis == -1) {
      return methodInvocation;
    } else {
      return methodInvocation.substring(0, openParenthesis);
    }
  }

  public String generateFunctionArgs(String[] parameterNames) {
    StringBuilder sb = new StringBuilder();
    sb.append("(");

    for (int i = 0; i < parameterNames.length; i++) {
      sb.append(parameterNames[i]);

      if (i < parameterNames.length - 1) {
        sb.append(", ");
      }
    }
    sb.append(")");

    return sb.toString();

  }
}
