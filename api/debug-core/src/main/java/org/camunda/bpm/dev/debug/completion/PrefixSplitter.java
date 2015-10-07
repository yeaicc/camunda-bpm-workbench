package org.camunda.bpm.dev.debug.completion;


/**
 * Implement for language-specific parsing of code completion paths
 *
 * @author Thorben Lindhauer
 */
public interface PrefixSplitter {

  String[] split(String prefix);

  int lastSplit(String path);

  String[] extractMethodArgs(String methodInvocation);

  String extractMethodName(String methodInvocation);

  String generateFunctionArgs(String[] parameterNames);
}
