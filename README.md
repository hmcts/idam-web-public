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

## Versioning

We use [SemVer](http://semver.org/) for versioning.
For the versions available, see the tags on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.