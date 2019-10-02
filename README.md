# IdAM Web Public
IdAM Web Public is a Spring Boot web application that provides the public facing UI for  Reform 
IdAM. This includes: login and sign-up page, page for requesting password reset.

## Getting started

### Prerequisites

- [JDK 8](https://www.oracle.com/java)

### Building

The project uses [Gradle](https://gradle.org) as a build tool but you don't have install it locally since there is a
`./gradlew` wrapper script.  

To build project please execute the following command:

```bash
$ ./gradlew build
```

## Developing

### Unit tests

To run all unit tests please execute the following command:

```bash
$ ./gradlew test
```

### Coding style tests

To run all checks (including unit tests) please execute the following command:

```bash
$ ./gradlew check
```

## Docker 

Required tools for macOS

- docker (homebrew cask)

### Build

```bash
docker build -t hmcts/idam-web-public:<tag> .
```

### Run Interactively 

```bash
# Running a temporary container?
docker run --rm -it -e STRATEGIC_SERVICE_URL=http://<local-idam-api-hostname> --entrypoint /bin/sh hmcts/idam-web-public:<tag>
# Is the container already running?
docker exec -it <hmcts/idam-web-public:<tag> /bin/sh
```

### Run as Daemon 

See the webapps docker-compose.yml file.
Docker compose expects the image to tag to be `local`.

```bash
docker-compose up
```

### Docker Compose Notes

Expected error: Access denied. ForgeRock connection is not yet implemented. Please use the following URI to obtain the the security code page.

`http://localhost:18002/login/pin?client_id=tstsrv456&redirect_uri=http://localhost:8084/ui/login`

### AKS Troubleshooting Mode

Use the `/configprops` & `/env` endpoints to learn more about the target configuration. To bypass sanitisation, use either of the implemtations below.

```yaml
# application.yaml
management:
  security:
    enabled: false
  endpoint:
    configprops:
      keys-to-sanitize:
        - nothing
    env:
     keys-to-sanitize:
        - nothing
  endpoints:
    web:
      base-path: /
      exposure:
        include: health,info,configprops,env
    ...
# values.yaml
  ...
  environment:
    MANAGEMENT_ENDPOINT_CONFIGPROPS_KEYS-TO-SANITIZE_0: nothing
    MANAGEMENT_ENDPOINT_ENV_KEYS-TO-SANITIZE_0: nothing
    MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE: health,info,configprops,env
  ...
# K8s manifest
        - name: MANAGEMENT_ENDPOINT_CONFIGPROPS_KEYS-TO-SANITIZE_0
          value: nothing
        - name: MANAGEMENT_ENDPOINT_ENV_KEYS-TO-SANITIZE_0
          value: nothing
        - name: MANAMANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE
          value: health,info,configprops,env
```

## Versioning

We use [SemVer](http://semver.org/) for versioning.
For the versions available, see the tags on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.