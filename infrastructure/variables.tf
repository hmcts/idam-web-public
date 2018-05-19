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
