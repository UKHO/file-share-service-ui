locals {
  front_door_custom_domain_enabled = var.front_door_custom_domain_hostname != ""
  front_door_api_enabled           = var.front_door_api_origin_hostname != ""
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

  origin_groups = merge({
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
    }, local.front_door_api_enabled ? {
    # Single origin, so no health probe.
    fssapi = {
      name                     = "fssui-${local.env_name}-api-origin-group"
      session_affinity_enabled = false
      load_balancing = {
        sample_size                        = 4
        successful_samples_required        = 3
        additional_latency_in_milliseconds = 50
      }
    }
  } : {})

  # Private Link origin: Front Door reaches the static website over a private endpoint, not the public internet.
  origins = merge({
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
    }, local.front_door_api_enabled ? {
    # APIM gateway (public); the UI's API calls must go through APIM for JWT validation and the auth cookie.
    fssapi_apim = {
      name                           = "fssui-${local.env_name}-api-origin"
      origin_group_key               = "fssapi"
      enabled                        = true
      host_name                      = var.front_door_api_origin_hostname
      http_port                      = 80
      https_port                     = 443
      origin_host_header             = var.front_door_api_origin_hostname
      priority                       = 1
      weight                         = 1000
      certificate_name_check_enabled = true
    }
  } : {})

  custom_domains = local.front_door_custom_domain_enabled ? {
    fssui_domain = {
      name        = "fssui-${local.env_name}-domain"
      dns_zone_id = var.front_door_custom_domain_dns_zone_id != "" ? var.front_door_custom_domain_dns_zone_id : null
      host_name   = var.front_door_custom_domain_hostname
      tls         = {} # Defaults: ManagedCertificate with TLS12
    }
  } : {}

  routes = merge({
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
    }, local.front_door_api_enabled ? {
    fssapi_route = {
      name                   = "fssui-${local.env_name}-api-route"
      origin_group_key       = "fssapi"
      origin_keys            = ["fssapi_apim"]
      enabled                = var.front_door_route_enabled
      forwarding_protocol    = "HttpsOnly"
      https_redirect_enabled = true
      patterns_to_match      = ["/api/*"]
      supported_protocols    = ["Http", "Https"]
      custom_domain_keys     = local.front_door_custom_domain_enabled ? ["fssui_domain"] : []
      link_to_default_domain = !local.front_door_custom_domain_enabled
      rule_set_keys          = ["fssapi"]
    }
  } : {})

  # Same mapping as the old proxy: /api/auth/* -> APIM session API, /api/* -> APIM FSS API.
  rule_sets = local.front_door_api_enabled ? {
    fssapi = {
      name = "fssui${replace(local.env_name, "-", "")}api"
    }
  } : {}

  rules = local.front_door_api_enabled ? {
    rewrite_auth = {
      name              = "rewriteauth"
      rule_set_key      = "fssapi"
      order             = 1
      behavior_on_match = "Stop"
      actions = {
        url_rewrite_action = {
          source_pattern          = "/api/auth/"
          destination             = "/${var.front_door_api_auth_path}/"
          preserve_unmatched_path = true
        }
      }
      conditions = {
        url_path_condition = {
          operator         = "BeginsWith"
          negate_condition = false
          match_values     = ["api/auth/"]
          transforms       = ["Lowercase"]
        }
      }
    }
    rewrite_api = {
      name              = "rewriteapi"
      rule_set_key      = "fssapi"
      order             = 2
      behavior_on_match = "Continue"
      actions = {
        url_rewrite_action = {
          source_pattern          = "/api/"
          destination             = "/${var.front_door_api_path}/"
          preserve_unmatched_path = true
        }
      }
      # Same shape as rewrite_auth; Terraform 1.3.7 won't unify null with an object here.
      conditions = {
        url_path_condition = {
          operator         = "BeginsWith"
          negate_condition = false
          match_values     = ["api/"]
          transforms       = ["Lowercase"]
        }
      }
    }
  } : {}
}
