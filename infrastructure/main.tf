module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "idam-sandbox"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = false
  subscription          = "sandbox"
  additional_host_name  = "${var.external_host_name}"
  capacity     = "${var.capacity}"

  app_settings = {
    STRATEGIC_SERVICE_URL = "http://idam-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  }
}