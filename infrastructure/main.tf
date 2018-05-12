module "idam-web-public" {
  source                = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product               = "${var.product}-${var.app}"
  location              = "${var.location}"
  env                   = "idam-sandbox"
  ilbIp                 = "${var.ilbIp}"
  is_frontend           = false
  subscription          = "sandbox"
  capacity              = "${var.capacity}"

  app_settings = {
    STRATEGIC_SERVICE_URL = "http://api-dev1.fridam.reform.hmcts.net"
  }
}