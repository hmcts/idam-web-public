FROM java:8-jdk
MAINTAINER IdAM

ARG JARFILE
ENV JARFILE=$JARFILE

ENV JAVA_HOME              /usr/lib/jvm/java-8-openjdk-amd64
ENV JAVA_OPTS              "-Djava.security.egd=file:/dev/./urandom -Xmx1024m -Xms512m -XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC"
ENV PATH                   $PATH:$JAVA_HOME/bin

#ENV TIME_ZONE              Europe/London

#RUN echo "$TIME_ZONE" > /etc/timezone

WORKDIR /app

EXPOSE 80

COPY $JARFILE /app/$JARFILE

CMD ["/bin/sh", "-c", "java $JAVA_OPTS -jar /app/$JARFILE"]
