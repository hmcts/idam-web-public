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

variable "redis_enabled" {
  type = map
  default = {
    idam-sandbox  = true
    idam-saat     = false
    idam-sprod    = false
    idam-preview  = true
    idam-demo     = true
    idam-ithc     = true
    idam-perftest = true
    idam-aat      = true
    idam-prod     = true
  }
}