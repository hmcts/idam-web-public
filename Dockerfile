ARG APP_INSIGHTS_AGENT_VERSION=2.5.1

FROM hmctspublic.azurecr.io/base/java:openjdk-11-distroless-1.4

LABEL maintainer=IDAM \
      owner="HM Courts & Tribunals Service"

# Docker Base Image Defaults
#   WORKDIR is /opt/app
#   USER is hmcts
#   ENTRYPOINT is /usr/bin/java -jar

ENV SERVER_PORT=8080

ADD --chown=hmcts:hmcts build/libs/idam-web-public.war \
                        lib/AI-Agent.xml \
                        lib/applicationinsights-agent-2.5.1.jar /opt/app/

CMD ["-Dspring.profiles.active=docker,local", "idam-web-public.war"]

EXPOSE 8080/tcp
