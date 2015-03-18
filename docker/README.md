# camunda BPM workbench docker image

Test the latest version of the camunda-bpm-workbench embedded in the
latest [camunda-bpm-platform tomcat distro][platform].

Use the image from the [registry][workbench]:

```
docker run --name workbench -p 8080:8080 -p 8090:8090 -p 9090:9090 \
           camunda/camunda-bpm-workbench
```

Or build it yourself with [docker-compose][] from the [repository][]:

```
docker-compose up workbench
```


[platform]: https://registry.hub.docker.com/u/camunda/camunda-bpm-platform/
[workbench]: https://registry.hub.docker.com/u/camunda/camunda-bpm-workbench/
[docker-compose]: https://docs.docker.com/compose/
[repository]: https://github.com/camunda/camunda-bpm-workbench/tree/master/docker
