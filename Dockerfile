 # renovate: datasource=github-releases depName=microsoft/ApplicationInsights-Java
ARG APP_INSIGHTS_AGENT_VERSION=3.5.2

# Application image
FROM hmctspublic.azurecr.io/base/java:21-distroless

LABEL maintainer=IDAM \
      owner="HM Courts & Tribunals Service"

# Docker Base Image Defaults
#   WORKDIR is /opt/app
#   USER is hmcts
#   ENTRYPOINT is /usr/bin/java -jar

ENV SERVER_PORT=8080

ADD --chown=hmcts:hmcts build/libs/idam-web-public.war \
                        lib/applicationinsights.json /opt/app/

CMD [ \
     "-Dspring.profiles.active=docker,local", \
     "--add-opens", "java.base/java.lang=ALL-UNNAMED", \
     "--add-opens", "java.base/java.time=ALL-UNNAMED", \
     "idam-web-public.war" \
     ]

EXPOSE 8080/tcp
