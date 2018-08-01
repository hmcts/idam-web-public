// Infrastructural variables
variable "product" { }

variable "component" { }

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "subscription" { }

variable "app" {
  default = "web-public"
}

variable "capacity" {
  default = "1"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided."
  default = ""
}

variable "common_tags" {
  type = "map"
}