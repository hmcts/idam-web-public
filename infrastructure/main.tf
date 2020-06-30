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

data "azurerm_virtual_network" "idam" {
  name                = "core-infra-vnet-idam-${var.env}"
  resource_group_name = "core-infra-idam-${var.env}"
}

data "azurerm_key_vault" "idam" {
  name                = "${local.vault_name}"
  resource_group_name = "idam-idam-${var.env}"
}

module "redis-cache" {
  source      = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product     = var.product
  location    = var.location
  env         = var.env
  subnetid    = element(azurerm_virtual_network.idam.subnets, 3)
  common_tags = var.common_tags
}

resource "azurerm_key_vault_secret" "redis_hostname" {
  name         = "redis-hostname"
  value        = module.redis-cache.host_name
  key_vault_id = data.azurerm_key_vault.default.id
}

resource "azurerm_key_vault_secret" "redis_port" {
  name         = "redis-hostname"
  value        = module.redis-cache.redis_port
  key_vault_id = data.azurerm_key_vault.default.id
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "redis-key"
  value        = module.redis-cache.access_key
  key_vault_id = data.azurerm_key_vault.default.id
}