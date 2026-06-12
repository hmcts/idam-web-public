# AGENTS.md

## General

Plan code changes and summarise them for confirmation before applying them.

## Project Context

`idam-web-public` is expected to be replaced soon and is effectively in maintenance mode. Avoid large framework migrations or speculative dependency upgrades unless the user explicitly asks for them.

Spring upgrade paths are limited because this is a JSP-based UI project on Spring Boot 2.7 / Spring Framework 5.3.x. Moving to Spring Boot 3 / Framework 6 is not a simple dependency bump: it brings Jakarta namespace changes and compatibility work across JSP, servlet, Spring MVC, Spring Security, embedded Tomcat, and related tag libraries. For Spring CVEs, first check whether a public compatible fix exists. If the only fix requires commercial Spring 5.3.x artifacts or a Spring Boot 3 / Framework 6 migration, assess application reachability and suppress only when the advisory preconditions are demonstrably unreachable in this application and document the evidence in the suppression rationale.

## Dependency-Check / Spring CVE Triage

Before changing dependencies or suppressions:

- Review `dependency-check-suppressions.xml` and keep new entries in the existing style: narrow GAV regex, CVE list, and application-specific rationale.
- For Spring CVEs, check the official Spring advisory and fixed versions first.
- Do not assume a Spring Framework override is safe just because a fixed version exists. Confirm public availability and compatibility with Spring Boot 2.7 first.
- Prefer suppression only after confirming that the advisory preconditions are not reachable in this application.

Useful checks for Spring CVE reachability:

- Runtime Spring versions: `GRADLE_USER_HOME=/tmp/idam-gradle-home ./gradlew dependencies --configuration runtimeClasspath`
- WebFlux and multipart usage: search for `webflux`, `RouterFunction`, `ServerRequest`, `MultipartFile`, `PartEvent`
- Static resource handling: search for `addResourceHandlers`, `resourceChain`, `VersionResourceResolver`, `EncodedResourceResolver`, `file:`
- SpEL usage: search for `ExpressionParser`, `SpelExpressionParser`, `parseExpression`, `StandardEvaluationContext`, `<spring:eval`
- WebSocket usage: search for `spring-websocket`, `@EnableWebSocket`, `WebSocketHandler`, `STOMP`, `SockJS`
- Ant path matching: search for `AntPathMatcher`, `PathMatcher`, `extractUriTemplateVariables`
- JSP form tag CSS attributes: search for `cssClass`, `cssErrorClass`, `cssStyle` on `<form:*>`

Validation after suppression edits:

- `xmllint --noout dependency-check-suppressions.xml`
- `git diff --check`
- Run dependency-check if possible. NVD HTTP 429 or update failures are not evidence that suppressions failed; report NVD rate limiting separately from suppression matching.
