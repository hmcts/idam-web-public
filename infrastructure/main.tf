locals {
  secure_actuator_endpoints = "${var.env == "idam-prod" || var.env == "idam-demo" ? true : false}"
}

module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=SIDM-1439_stop_overwriting_ssl_settings"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "${var.env}"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = "${var.env == "idam-preview" ? 0 : 1}"
  subscription          = "${var.subscription}"
  capacity              = "${var.capacity}"
  additional_host_name  = "hmcts-access.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED   = "${local.secure_actuator_endpoints}"
    ENDPOINTS_ENABLED             = "${local.secure_actuator_endpoints ? false : true}"

    // remove when SSL certificates are in place
    SSL_VERIFICATION_ENABLED      = "${var.env == "idam-prod" ? "true" : "false"}"

    STRATEGIC_SERVICE_URL         = "https://idam-api.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  }
}
