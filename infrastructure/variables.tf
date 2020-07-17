// Infrastructural variables
variable "product" {}

variable "component" {}

variable "deployment_namespace" {}

variable "location" {
  default = "UK South"
}

variable "certificate_name" {
  default = ""
}

variable "env" {}

variable "ilbIp" {}

variable "subscription" {}

variable "app" {
  default = "web-public"
}

variable "capacity" {
  default = "2"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided."
  default     = ""
}

variable "common_tags" {
  type = "map"
}

variable "ga_tracking_id" {
  description = "Google Analytics tracking ID"
  default     = ""
}

variable ssl_verification_enabled {
  description = "Control whether SSL verification of SSL certificates is enabled (disable only in environments without real certificates set for webapps)."
  default     = true
}

variable idam_api_url_override {
  description = "IdAM API URL"
  default     = ""
}

variable idam_api_testing_support_url_override {
  description = "IdAM API URL for testing support calls"
  default     = ""
}

variable "https_only" {
  description = "Disable HTTP access to the web app (Azure triggers 301 to HTTPS)."
  default     = "true"
}

variable "external_host_name_override" {
  description = "Non-default custom domain name for the webapp"
  default     = ""
}

variable asp_name_override {
  description = "App Service Plan Name"
  default     = ""
}

variable asp_rg_override {
  description = "App Service Plan Resource Group"
  default     = ""
}

variable vault_name_override {
  description = "Vault Name"
  default = ""
}

variable "vnet_private_ip_pattern" {
  description = "Private VNet IP Filter Pattern for Policies Evaluation"
  default     = "10\\.\\d+\\.\\d+\\.\\d+"
}

variable deploy_redis_into_vnet {
  type = bool
  default = true
}