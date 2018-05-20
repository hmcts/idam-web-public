locals {
  integration_env = "${var.env == "idam-preview" ? "idam-saat" : var.env}"
}

module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "${var.env}"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = true
  subscription          = "${var.subscription}"
  capacity              = "${var.capacity}"
  additional_host_name  = "hmcts-access.${replace(var.env, "idam-", "")}.platform.hmcts.net"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED   = "${var.env == "idam-prod" ? "true" : "false"}"

    // remove when SSL certificates are in place
    SSL_VERIFICATION_ENABLED      = "${var.env == "idam-prod" ? "true" : "false"}"

    STRATEGIC_SERVICE_URL         = "https://idam-api-${local.integration_env}.service.core-compute-${local.integration_env}.internal"
  }
}