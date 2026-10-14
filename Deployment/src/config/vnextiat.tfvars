# vNext IAT environment Terraform variable values.
# Loaded via -var-file by terraform_conditional_run.ps1 when config/<workspace>.tfvars exists.
# Secrets and other per-environment values still come from pipeline variable groups as TF_VAR_*.

# Front Door onboarding (vNext IAT) — PBI 313049
front_door_enabled                = true
front_door_route_enabled          = true
front_door_subscription_id        = "773c0f37-8bf4-409d-b473-c6de8b31bc96"
front_door_profile_name           = "frontdoor-dev-fd"
front_door_resource_group         = "frontdoor-dev-rg"
front_door_shared_endpoint_name   = "frontdoor-dev-fd"
# TODO: SERVICE_DNS_URL from File-Share-Service-UI-vNext-IAT-Deploy-Variables (hostname only, no https://).
front_door_custom_domain_hostname = ""
