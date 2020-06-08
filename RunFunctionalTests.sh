#!/bin/bash


export SMOKE_TEST_USER_USERNAME=idamOwner@HMCTS.NET
export SMOKE_TEST_USER_PASSWORD=Ref0rmIsFun
export NOTIFY_API_KEY=sidam_sandbox-b7ab8862-25b4-41c9-8311-cb78815f7d2d-1f3ed33e-7fb8-4c42-912f-a8300b78340f

export PROXY_SERVER=http://proxyout.reform.hmcts.net:8080
export IDAMAPI=https://idam-api.sandbox.platform.hmcts.net
export TEST_URL=https://idam-web-public.sandbox.platform.hmcts.net

# node_modules/codeceptjs/bin/codecept.js run --grep @functional

./gradlew --no-daemon --info --rerun-tasks functional
