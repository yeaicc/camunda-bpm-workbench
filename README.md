# camunda BPM workbench

[Camunda BPM][camundabpm] Workbench is a web-application allowing you to implement your BPMN processes directly in your browser.

![workbench close-up](https://raw.githubusercontent.com/camunda/camunda-bpm-workbench/master/resources/screenshot.png)


## Resources

* [Releases](https://github.com/camunda/camunda-bpm-workbench/releases)
* [Documentation](https://github.com/camunda/camunda-bpm-workbench/wiki)
* [Issues](https://github.com/camunda/camunda-bpm-workbench/issues)


## Components

The app provides a BPMN modeler, a script editing component and a debugger. These allow you to design BPMN 2.0 processes and interactively explore their execution.


### BPMN Modeler

The BPMN renderer embeds [bpmn.io][bpmnio] rendering BPMN 2.0 XML files directly inside the browser.
You can simply drop a BPMN file from your desktop and have it rendered inside the Browser.

### Script Editor

The script editor allows editing the scripts associated with BPMN Script Tasks. It embedds the well-known [Ace][ace] editor for comfortable script editing.

### Debugger

The debugger connects to a camunda BPM runtime using a Websocket.
Put breakpoints directly inside the process diagram, inspect the current state of the process variables and interact with a process instance through an interactive scripting console.


## Setup and Run

Clone the git repository:

```
git clone git@github.com:camunda/camunda-bpm-workbench.git
```

Install client dependencies:

```
(cd webapp/ && npm install && bower install)
```

Build and start backend on `localhost:9090`:

```
(cd api && mvn clean install)
(cd api/debug-service-websocket && mvn exec:java -P develop)
```

Build client and start it on `localhost:9000`

```
(cd webapp/ && grunt auto-build)
```

Open [http://localhost:9000](http://localhost:9000) in your browser.

## Docker

Start the workbench embedded in the latest camunda-bpm-platform tomcat distro with:

```
docker run --name workbench -p 8080:8080 -p 8090:8090 -p 9090:9090 \
           camunda/camunda-bpm-workbench
```

Or use the [`docker-compose.yml`](docker/docker-compose.yml) in the [`docker/`](docker/) directory:

```
docker-compose up workbench
```

# License

This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE (AGPL)

[ace]: http://ace.c9.io
[bpmnio]: http://bpmn.io
[camundabpm]: http://camunda.org
