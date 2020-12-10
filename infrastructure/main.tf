terraform {
  backend "azurerm" {}
}

provider "azurerm" {
  version = "~> 2.17.0"
  features {}
}

locals {
  vault_name                 = "${var.product}-${var.env}"
  vault_uri                  = "https://${local.vault_name}.vault.azure.net/"
  default_external_host_name = "idam-web-public.${replace(var.env, "idam-", "")}.platform.hmcts.net"
  env                        = "${var.env == "idam-preview" && var.product == "idam" ? "idam-dev" : var.env}"
  tags                       = "${merge(var.common_tags, map("environment", local.env))}"
}

data "azurerm_virtual_network" "idam" {
  name                = "core-infra-vnet-${var.env}"
  resource_group_name = "core-infra-${var.env}"
}

data "azurerm_key_vault" "idam" {
  name                = local.vault_name
  resource_group_name = "idam-${var.env}"
}
