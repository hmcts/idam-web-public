module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "${var.env}"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = "${var.env == "idam-preview" ? 0 : 1}"
  subscription          = "${var.subscription}"
  capacity              = "${var.capacity}"
  additional_host_name  = "idam-web-public.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED   = "${var.env == "idam-prod" ? "true" : "false"}"

    // remove when SSL certificates are in place
    SSL_VERIFICATION_ENABLED      = "${var.env == "idam-prod" ? "true" : "false"}"

    STRATEGIC_SERVICE_URL         = "https://idam-api-${var.env}.service.core-compute-${var.env}.internal"
  }
}