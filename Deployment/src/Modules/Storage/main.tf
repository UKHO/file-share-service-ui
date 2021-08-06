resource "azurerm_storage_account" "storage" {
  name = lower(var.name)
  resource_group_name = var.resource_group_name
  location = var.location
  account_tier = "Standard"
  account_replication_type = "LRS"
  account_kind = "StorageV2"

  static_website {
    index_document = "index.html"
  }
    network_rules {
    default_action             = "allow"
    ip_rules                   = var.allowed_ips
    bypass                     = ["Logging", "Metrics", "AzureServices"]
    virtual_network_subnet_ids = [var.hub_n_spoke_subnet,var.agent_subnet]
  }

  tags = var.tags
}
