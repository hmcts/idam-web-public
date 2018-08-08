locals {
  preview_vault_name = "idam-idam-preview"
  non_preview_vault_name = "${var.product}-${var.env}"
  vault_name = "${var.env == "idam-preview" ? local.preview_vault_name : local.non_preview_vault_name}"

  vault_uri = "https://${local.vault_name}.vault.azure.net/"
  secure_actuator_endpoints = "${var.env == "idam-prod" || var.env == "idam-demo" ? true : false}"

  idam_api = "https://idam-api.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  idam_api_internal = "${var.idam_api_url != "" ? var.idam_api_url : local.idam_api}"

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
  https_only            = "${var.https_only}"
  additional_host_name  = "idam-web-public.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  common_tags = "${var.common_tags}"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED   = "${local.secure_actuator_endpoints}"
    ENDPOINTS_ENABLED             = "${local.secure_actuator_endpoints ? false : true}"

    SSL_VERIFICATION_ENABLED      = "${var.ssl_verification_enabled}"

    STRATEGIC_SERVICE_URL         = "${local.idam_api_internal}"

    GA_TRACKING_ID                = "${var.ga_tracking_id}"
  }
}