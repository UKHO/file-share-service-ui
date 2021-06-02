variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "fss-ui"
}

locals {
  env_name				= lower(terraform.workspace)
  service_name			= "fss"
  tags = {
    SERVICE          = "File Share Service"
    ENVIRONMENT      = local.env_name
    SERVICE_OWNER    = "UKHO"
    RESPONSIBLE_TEAM = "Mastek"
    CALLOUT_TEAM     = "On-Call_N/A"
    COST_CENTRE      = "P4052"
  }
}
