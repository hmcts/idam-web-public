ARG APP_INSIGHTS_AGENT_VERSION=2.4.0

FROM hmcts/cnp-java-base:openjdk-8u191-jre-alpine3.9-2.0.2

LABEL maintainer=SIDAM \
      owner="HM Courts & Tribunals Service"

# Docker Base Image Defaults
#   WORKDIR is /opt/app
#   USER is hmcts
#   ENTRYPOINT is /usr/bin/java -jar

ENV SERVER_PORT=8080

ADD --chown=hmcts:hmcts build/libs/idam-web-public.war \
                lib/AI-Agent.xml lib/applicationinsights-agent-2.4.0.jar /opt/app/

RUN chmod +x /opt/app/idam-web-public.war

CMD ["idam-web-public.war"]

EXPOSE 8080/tcp
