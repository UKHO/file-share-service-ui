variable "location" {
  type    = string
  default = "uksouth"
}

variable "resource_group_name" {
  type    = string
  default = "fss-ui"
}

variable "allowed_ips" {
  type = list
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
  env_name			  	= lower(terraform.workspace)
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

# Front Door; set per environment in config/<workspace>.tfvars.
variable "front_door_enabled" {
  description = "Whether to configure Front Door delivery routing for the FSS UI static website."
  type        = bool
  default     = false
}

variable "front_door_route_enabled" {
  description = "Whether the Front Door route is enabled. Allows the route to be disabled without removing resources. Only applies when front_door_enabled is true."
  type        = bool
  default     = true
}

variable "front_door_subscription_id" {
  description = "The subscription ID where the shared Azure Front Door profile is deployed."
  type        = string
  default     = ""
}

variable "front_door_profile_name" {
  description = "The name of the existing shared Azure Front Door profile created by the platform team."
  type        = string
  default     = ""
}

variable "front_door_resource_group" {
  description = "The resource group containing the shared Azure Front Door profile."
  type        = string
  default     = ""
}

variable "front_door_shared_endpoint_name" {
  description = "The name of the shared Front Door endpoint to attach routes to."
  type        = string
  default     = ""
}

variable "front_door_custom_domain_hostname" {
  description = "The public hostname for the custom domain. Leave empty to use the default AFD endpoint hostname."
  type        = string
  default     = ""
}

variable "front_door_custom_domain_dns_zone_id" {
  description = "The resource ID of the Azure DNS zone used for custom domain validation. May be empty while DNS is hosted outside Azure."
  type        = string
  default     = ""
}

variable "front_door_api_origin_hostname" {
  description = "APIM gateway hostname that /api/* on the UI domain is forwarded to. Empty skips the API route."
  type        = string
  default     = ""
}

variable "front_door_api_path" {
  description = "APIM path of the FSS API for this environment (e.g. fss-vnextiat); /api/* is rewritten to it."
  type        = string
  default     = ""
}

variable "front_door_api_auth_path" {
  description = "APIM path of the FSS UI session API for this environment (e.g. fss-ui-auth-vnextiat); /api/auth/* is rewritten to it."
  type        = string
  default     = ""
}
