module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "${var.env}"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = true
  subscription          = "${var.subscription}"
  capacity              = "${var.capacity}"
  additional_host_name  = "${var.external_host_name}"

  app_settings = {
    STRATEGIC_SERVICE_URL = "http://api-dev1.fridam.reform.hmcts.net"
  }
}
