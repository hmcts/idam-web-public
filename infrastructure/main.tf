locals {
  integration_env = "${var.env == "idam-preview" ? "idam-aat" : var.env}"

  preview_vault_name = "idam-idam-preview"
  non_preview_vault_name = "${var.product}-${var.env}"
  vault_name = "${var.env == "idam-preview" ? local.preview_vault_name : local.non_preview_vault_name}"

  vault_uri = "https://${local.vault_name}.vault.azure.net/"
  idam_api = "https://idam-api-${local.integration_env}.service.core-compute-${local.integration_env}.internal"

  secure_actuator_endpoints = "${var.env == "idam-prod" || var.env == "idam-demo" ? true : false}"

  integration_env = "${var.env == "idam-preview" ? "idam-aat" : var.env}"
}

module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
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

    STRATEGIC_SERVICE_URL         = "${local.idam_api}"

  }
}