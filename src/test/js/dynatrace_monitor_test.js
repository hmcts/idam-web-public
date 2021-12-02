const assert = require('assert');
var TestData = require('./config/test_data');

Feature('Error message is displayed when trying to use an expired link');

Scenario('@smoke @dynatracemonitor I can access a dynatrace link', async ({ I }) => {

  let rsp = await I.getDynatraceMonitorResponseStatus();
  console.log("dynatract response status " + rsp);
  assert("403" != rsp);

}).retry(TestData.SCENARIO_RETRY_LIMIT);