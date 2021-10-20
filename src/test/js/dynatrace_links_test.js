const assert = require('assert');
var TestData = require('./config/test_data');

Feature('Error message is displayed when trying to use an expired link');

Scenario('@smoke @dynatracelinks I can access a dynatrace link', async ({ I }) => {

  let rsp = await I.getDynatraceRUMLinkResponseStatus();
  console.log("dynatract response status " + rsp);
  assert("403" != rsp);

}).retry(TestData.SCENARIO_RETRY_LIMIT);