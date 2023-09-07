#!/bin/bash
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

echo ${TEST_URL}

zap-x.sh -daemon -host 0.0.0.0 -port 1001 -config database.newsession=3 -config database.newsessionprompt=false -config api.disablekey=true -config scanner.attackOnStart=true -config view.mode=attack -config -config globalexcludeurl.url_list.url.regex='^https?:\/\/.*\/(?:.*login.*)+$' -config rules.cookie.ignorelist=_ga,_gid,_gat,dtCookie,dtLatC,dtPC,dtSa,rxVisitor,rxvt -config connection.dnsTtlSuccessfulQueries=-1 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true &
i=0
while !(curl -s http://0.0.0.0:1001) > /dev/null
  do
    i=$(( (i+1) %4 ))
    sleep .1
  done
  echo "Writing config file"

cat <<EOT >> configfile
globalexcludeurl.url_list.url(0).regex='.*jquery-3.4.1.min.js$'
globalexcludeurl.url_list.url(0).enabled=true
globalexcludeurl.url_list.url(1).regex='.*jquery-3.5.1.min.js$'
globalexcludeurl.url_list.url(1).enabled=true
globalexcludeurl.url_list.url(2).regex='.*/assets/images.*'
globalexcludeurl.url_list.url(2).enabled=true
globalexcludeurl.url_list.url(3).regex='.*/assets/stylesheets.*'
globalexcludeurl.url_list.url(3).enabled=true
globalexcludeurl.url_list.url(4).regex='.*/assets/javascripts.*'
globalexcludeurl.url_list.url(4).enabled=true
globalexcludeurl.url_list.url(5).regex='.*/ruxitagentjs_.*'
globalexcludeurl.url_list.url(5).enabled=true
globalexcludeurl.url_list.url(6).regex='.*/terms-and-conditions.*'
globalexcludeurl.url_list.url(6).enabled=true
globalexcludeurl.url_list.url(7).regex='.*/privacy-policy.*'
globalexcludeurl.url_list.url(7).enabled=true
globalexcludeurl.url_list.url(8).regex='.*/contact-us.*'
globalexcludeurl.url_list.url(8).enabled=true
globalexcludeurl.url_list.url(9).regex='.*/login.*'
globalexcludeurl.url_list.url(9).enabled=true
globalexcludeurl.url_list.url(10).regex='.*/cookies.*'
globalexcludeurl.url_list.url(10).enabled=true
globalexcludeurl.url_list.url(11).regex='.*/cookie-preferences.*'
globalexcludeurl.url_list.url(11).enabled=true
line 2
EOT

  echo "ZAP has successfully started"
  zap-full-scan.py -t ${TEST_URL} -P 1001 -l FAIL -r /zap/wrk/activescan.html -d  -c configfile


  echo 'Changing owner from $(id -u):$(id -g) to $(id -u):$(id -u)'
  chown -R $(id -u):$(id -u) /zap/wrk/activescan.html
  curl --fail http://0.0.0.0:1001/OTHER/core/other/jsonreport/?formMethod=GET --output /zap/wrk/report.json
  mkdir -p /zap/wrk/functional-output
  chmod a+wx /zap/wrk/functional-output
  cp /zap/wrk/*.html /zap/wrk/functional-output/
  cp /zap/wrk/report.json /zap/wrk/functional-output/