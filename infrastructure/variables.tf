// Infrastructural variables
variable "product" {
  default = "idam"
}

variable "microservice" {
  default = "web-public"
}

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "subscription" { }

variable "external_host_name" {
  default = "hmcts-access.sandbox.platform.hmcts.net"
}
