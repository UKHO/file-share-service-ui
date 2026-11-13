# Live environment Terraform variable values.
# Loaded via -var-file by terraform_conditional_run.ps1 when config/<workspace>.tfvars exists.
# Secrets and other per-environment values still come from pipeline variable groups as TF_VAR_*.

# Front Door onboarding (Live) — PBI 313049.
front_door_enabled                = true
front_door_route_enabled          = true
front_door_subscription_id        = "25a99057-6550-4e10-a8ec-778bc565275c"
front_door_profile_name           = "frontdoor-live-fd"
front_door_resource_group         = "frontdoor-live-rg"
front_door_shared_endpoint_name   = "frontdoor-live-fd"
front_door_custom_domain_hostname = "fss.admiralty.co.uk"
