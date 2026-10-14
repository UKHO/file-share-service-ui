locals {
  front_door_custom_domain_enabled = var.front_door_custom_domain_hostname != ""
}

module "front_door_delivery" {
  count  = var.front_door_enabled ? 1 : 0
  source = "github.com/UKHO/tfmodule-alz-front-door-compliant//modules/front-door-delivery?ref=v922453"

  providers = {
    azurerm = azurerm.frontdoor
  }

  front_door_profile_name   = var.front_door_profile_name
  front_door_resource_group = var.front_door_resource_group
  shared_endpoint_name      = var.front_door_shared_endpoint_name

  origin_groups = {
    fssui = {
      name                     = "fssui-${local.env_name}-origin-group"
      session_affinity_enabled = false
      load_balancing = {
        sample_size                        = 4
        successful_samples_required        = 3
        additional_latency_in_milliseconds = 50
      }
      health_probe = {
        protocol            = "Https"
        interval_in_seconds = 30
        request_type        = "GET"
        path                = "/"
      }
    }
  }

  # Private Link origin: Front Door reaches the static website over a private endpoint, not the public internet.
  origins = {
    fssui_site = {
      name                           = "fssui-${local.env_name}-origin"
      origin_group_key               = "fssui"
      enabled                        = true
      host_name                      = module.storage.primary_web_host
      http_port                      = 80
      https_port                     = 443
      origin_host_header             = module.storage.primary_web_host
      priority                       = 1
      weight                         = 1000
      certificate_name_check_enabled = true
      private_link = {
        request_message        = "fssui ${local.env_name} Front Door private link request"
        target_type            = "web"
        location               = var.location
        private_link_target_id = module.storage.storage_account_id
      }
    }
  }

  custom_domains = local.front_door_custom_domain_enabled ? {
    fssui_domain = {
      name        = "fssui-${local.env_name}-domain"
      dns_zone_id = var.front_door_custom_domain_dns_zone_id != "" ? var.front_door_custom_domain_dns_zone_id : null
      host_name   = var.front_door_custom_domain_hostname
      tls         = {} # Defaults: ManagedCertificate with TLS12
    }
  } : {}

  routes = {
    fssui_route = {
      name                   = "fssui-${local.env_name}-route"
      origin_group_key       = "fssui"
      origin_keys            = ["fssui_site"]
      enabled                = var.front_door_route_enabled
      forwarding_protocol    = "HttpsOnly"
      https_redirect_enabled = true
      patterns_to_match      = ["/*"]
      supported_protocols    = ["Http", "Https"]
      custom_domain_keys     = local.front_door_custom_domain_enabled ? ["fssui_domain"] : []
      link_to_default_domain = !local.front_door_custom_domain_enabled
    }
  }
}
