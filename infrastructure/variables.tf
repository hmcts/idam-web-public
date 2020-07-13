variable "product" {}

variable "component" {}

variable "deployment_namespace" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

variable "app" {
  default = "web-public"
}

variable "common_tags" {
  type = map
}

variable "deploy_redis_into_vnet" {
  type = map(bool)

  default = {
    idam-sandbox = false
  }
}
