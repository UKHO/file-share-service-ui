variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "fss-ui"
}

variable "allowed_ips" {
  type = map (any)
  default = {
    "dev"     = ["59.160.23.25", "210.18.83.151", "81.145.145.150", "62.172.108.0/27","20.90.99.211"]
    "qa"      = ["59.160.23.25", "210.18.83.151", "81.145.145.150", "62.172.108.0/27","20.90.99.211"]
    "prod"    = ["62.172.108.0/27"]
    }
}

variable "spoke_rg" {
  type = string
}

variable "spoke_vnet_name" {
  type = string
}

variable "spoke_subnet_name" {
  type = string
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

variable "agent_rg" {
  type = string
}

variable "agent_vnet_name" {
  type = string
}

variable "agent_subnet_name" {
  type = string
}

variable "agent_subscription_id" {
  type = string
}