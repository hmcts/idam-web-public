variable "product" {}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

variable "app" {
  default = "web-public"
}

variable "common_tags" {
  type = "map"
}