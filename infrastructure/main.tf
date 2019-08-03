provider "azurerm" {
  version = "1.22.1"
}

locals {
  default_vault_name = "${var.product}-${var.env}"
  vault_name = "${coalesce(var.vault_name_override, local.default_vault_name)}"
  vault_uri = "https://${local.vault_name}.vault.azure.net/"

  default_external_host_name = "idam-web-public.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  external_host_name = "${var.external_host_name_override != "" ? var.external_host_name_override : local.default_external_host_name}"

  default_idam_api = "https://idam-api.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  idam_api_url = "${var.idam_api_url_override != "" ? var.idam_api_url_override : local.default_idam_api}"

  idam_api_testing_support_url = "${var.idam_api_testing_support_url_override != "" ? var.idam_api_testing_support_url_override : local.idam_api_url}"

  default_asp_name = "${var.product}-${var.env}"
  asp_name = "${coalesce(var.asp_name_override, local.default_asp_name)}"

  default_asp_rg = "${var.product}-${var.env}"
  asp_rg = "${coalesce(var.asp_rg_override, local.default_asp_rg)}"

  secure_actuator_endpoints = "${var.env == "idam-prod" || var.env == "idam-demo" ? true : false}"

  env = "${var.env == "idam-preview" && var.product == "idam" ? "idam-dev" : var.env}"

  // in PRs var.product = "pr-XX-idam"
  tags = "${merge(var.common_tags, map("environment", local.env))}"
}

data "azurerm_key_vault" "cert_vault" {
  name = "infra-vault-${var.subscription}"
  resource_group_name = "${var.env == "prod" || var.env == "idam-prod" ? "core-infra-prod" : "cnp-core-infra"}"
}

module "idam-web-public" {
  source = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product = "${var.product}-${var.app}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${local.env == "idam-preview" ? 0 : 1}"
  subscription = "${var.subscription}"
  capacity = "${var.capacity}"
  https_only = "${var.https_only}"
  additional_host_name = "${local.env == "idam-preview" ? "null" : local.external_host_name}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  common_tags = "${local.tags}"
  java_container_version = "9.0"

  asp_name = "${local.asp_name}"
  asp_rg = "${local.asp_rg}"

  app_settings = {
    MANAGEMENT_SECURITY_ENABLED   = "${local.secure_actuator_endpoints}"
    ENDPOINTS_ENABLED             = "${local.secure_actuator_endpoints ? false : true}"

    SSL_VERIFICATION_ENABLED      = "${var.ssl_verification_enabled}"

    STRATEGIC_SERVICE_URL         = "${local.idam_api_url}"

    GA_TRACKING_ID                = "${var.ga_tracking_id}"
  }
}
