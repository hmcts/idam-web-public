provider "azurerm" {
  version = "1.19.0"
}

locals {
  preview_vault_name     = "idam-idam-preview"
  non_preview_vault_name = "${var.product}-${var.env}"
  vault_name             = "${var.env == "idam-preview" ? local.preview_vault_name : local.non_preview_vault_name}"

  vault_uri                 = "https://${local.vault_name}.vault.azure.net/"
  secure_actuator_endpoints = "${var.env == "idam-prod" || var.env == "idam-demo" ? true : false}"

  default_external_host_name = "idam-web-public.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  external_host_name         = "${var.external_host_name_override != "" ? var.external_host_name_override : local.default_external_host_name}"

  default_idam_api             = "https://idam-api.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  idam_api_url                 = "${var.idam_api_url_override != "" ? var.idam_api_url_override : local.default_idam_api}"
  idam_api_testing_support_url = "${var.idam_api_testing_support_url_override != "" ? var.idam_api_testing_support_url_override : local.idam_api_url}"

  default_asp_name = "${var.product}-${var.env}"
  asp_name         = "${coalesce(var.asp_name_override, local.default_asp_name)}"

  default_asp_rg = "${var.product}-${var.env}"
  asp_rg         = "${coalesce(var.asp_rg_override, local.default_asp_rg)}"
}

module "idam-web-public" {
  source                          = "git@github.com:hmcts/cnp-module-webapp?ref=0.1.1"
  product                         = "${var.product}-${var.app}"
  location                        = "${var.location}"
  env                             = "${var.env}"
  ilbIp                           = "${var.ilbIp}"
  is_frontend                     = "${var.env == "idam-preview" ? 0 : 1}"
  subscription                    = "${var.subscription}"
  capacity                        = "${lookup(var.capacity_env, var.env)}"
  https_only                      = "${var.https_only}"
  additional_host_name            = "${local.external_host_name}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  common_tags                     = "${map("environment","${var.env}-permanent","changeUrl", "${lookup(var.common_tags,"changeUrl")}","Team Name","${lookup(var.common_tags,"Team Name")"}) }"

  asp_name = "${local.asp_name}"
  asp_rg   = "${local.asp_rg}"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED = "${local.secure_actuator_endpoints}"
    ENDPOINTS_ENABLED           = "${local.secure_actuator_endpoints ? false : true}"

    SSL_VERIFICATION_ENABLED = "${var.ssl_verification_enabled}"

    STRATEGIC_SERVICE_URL = "${local.idam_api_url}"

    GA_TRACKING_ID = "${var.ga_tracking_id}"
  }
}
