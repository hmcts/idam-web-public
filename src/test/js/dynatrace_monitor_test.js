const assert = require('assert');
var TestData = require('./config/test_data');

Feature('Dynatrace monitor endpoint is not blocked by CSRF');

Scenario('@smoke @dynatracemonitor I can access a dynatrace endpoint', async ({ I }) => {

  let rsp = await I.getDynatraceMonitorResponseStatus();
  assert("403" != rsp);

}).retry(TestData.SCENARIO_RETRY_LIMIT);