terraform {
  backend "azurerm" {}
}

data "terraform_remote_state" "core-infra" {
  backend = "azurerm"

  config {
    resource_group_name  = "mgmt-state-store-${replace(var.env,"idam-","")}"
    storage_account_name = "mgmtstatestore${var.subscription}"
    container_name       = "mgmtstatestorecontainer${var.env}"
    key                  = "core-infra/${var.env}/terraform.tfstate"
  }
}