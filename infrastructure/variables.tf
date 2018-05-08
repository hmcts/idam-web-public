// Infrastructural variables
variable "product" { }

variable "component" { }

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "subscription" { }

variable "external_host_name" {
  default = "hmcts-access.sandbox.platform.hmcts.net"
}
