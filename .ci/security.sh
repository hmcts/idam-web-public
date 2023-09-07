#!/bin/bash
export LC_ALL=C.UTF-8
export LANG=C.UTF-8

echo ${TEST_URL}

zap-x.sh -daemon -host 0.0.0.0 -port 1001 -config database.newsession=3 -config database.newsessionprompt=false -config api.disablekey=true -config scanner.attackOnStart=true -config view.mode=attack -config globalexcludeurl.url_list.url.regex='^https?:\/\/.*\/(?:.*login.*)+$' -config rules.cookie.ignorelist=_ga,_gid,_gat,dtCookie,dtLatC,dtPC,dtSa,rxVisitor,rxvt -config connection.dnsTtlSuccessfulQueries=-1 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true &
i=0
while !(curl -s http://0.0.0.0:1001) > /dev/null
  do
    i=$(( (i+1) %4 ))
    sleep .1
  done
  echo "ZAP has successfully started"
  zap-full-scan.py -t ${TEST_URL} -P 1001 -l FAIL -r /zap/wrk/activescan.html -d --exclusions '[
                                                                                   {
                                                                                     "ruleName": "Exclude jquery 3.4",
                                                                                     "enabled": true,
                                                                                     "url": ".*jquery-3.4.1.min.js$",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude jquery 3.5",
                                                                                     "enabled": true,
                                                                                     "url": ".*jquery-3.5.1.min.js$",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude images",
                                                                                     "enabled": true,
                                                                                     "url": ".*/assets/images.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude stylesheets",
                                                                                     "enabled": true,
                                                                                     "url": ".*/assets/stylesheets.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude javascripts",
                                                                                     "enabled": true,
                                                                                     "url": ".*/assets/javascripts.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude ruxitagentjs",
                                                                                     "enabled": true,
                                                                                     "url": ".*/ruxitagentjs_.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude terms and conditions",
                                                                                     "enabled": true,
                                                                                     "url": ".*/terms-and-conditions.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude privacy policy",
                                                                                     "enabled": true,
                                                                                     "url": ".*/privacy-policy.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude contact us",
                                                                                     "enabled": true,
                                                                                     "url": ".*/contact-us.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude login",
                                                                                     "enabled": true,
                                                                                     "url": ".*/login.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude cookies",
                                                                                     "enabled": true,
                                                                                     "url": ".*/cookies.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   },
                                                                                   {
                                                                                     "ruleName": "Exclude cookie preferences",
                                                                                     "enabled": true,
                                                                                     "url": ".*/cookie-preferences.*",
                                                                                     "match": "URL",
                                                                                     "regex": true
                                                                                   }
                                                                                 ]'


  echo 'Changing owner from $(id -u):$(id -g) to $(id -u):$(id -u)'
  chown -R $(id -u):$(id -u) /zap/wrk/activescan.html
  curl --fail http://0.0.0.0:1001/OTHER/core/other/jsonreport/?formMethod=GET --output /zap/wrk/report.json
  mkdir -p /zap/wrk/functional-output
  chmod a+wx /zap/wrk/functional-output
  cp /zap/wrk/*.html /zap/wrk/functional-output/
  cp /zap/wrk/report.json /zap/wrk/functional-output/