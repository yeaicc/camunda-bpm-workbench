FROM camunda/camunda-bpm-platform:jboss-latest

ENV VERSION=1.0.0-alpha9 \
    GITHUB=https://github.com/camunda/camunda-bpm-workbench \
    MODULE=/camunda/modules/org/camunda/bpm/camunda-engine/main

ADD ${GITHUB}/releases/download/${VERSION}/camunda-workbench-dist-embeddable-${VERSION}.jar ${MODULE}/

RUN xmlstarlet ed -L -s //_:resources -t elem -n TMP -v "" \
      -i //TMP -t attr -n path -v "camunda-workbench-dist-embeddable-${VERSION}.jar" \
      -r //TMP -v resource-root \
      ${MODULE}/module.xml

RUN xmlstarlet ed -L -N cam=urn:org.camunda.bpm.jboss:1.1 \
      -s //cam:process-engines/cam:process-engine/cam:plugins -t elem -n TMP -v "" \
      -s //TMP -t elem -n class -v "org.camunda.bpm.debugger.server.EmbeddableDebugWebsocketBootstrap" \
      -r //TMP -v plugin \
      /camunda/standalone/configuration/standalone.xml

