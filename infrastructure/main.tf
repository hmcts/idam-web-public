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
  env = "${var.env == "idam-preview" && var.product == "idam" ? "idam-dev" : var.env}"
  tags = "${merge(var.common_tags, map("environment", local.env))}"
}
