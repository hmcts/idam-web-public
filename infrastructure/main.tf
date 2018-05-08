module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.component}"
  location              = "${var.location}"
  env                   = "${var.env}"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = "${var.env != "preview" ? 1: 0}"
  subscription          = "${var.subscription}"
  additional_host_name  = "${var.external_host_name}"
  https_only            = "true"

  asp_name = "idam-web-public"

  app_settings = {
    STRATEGIC_SERVICE_URL = "http://idam-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
  }
}