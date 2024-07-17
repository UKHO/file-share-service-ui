data "azurerm_subnet" "hub_n_spoke_subnet" {
  name                 = var.spoke_subnet_name
  virtual_network_name = var.spoke_vnet_name
  resource_group_name  = var.spoke_rg
}

module "storage" {
  source              = "./Modules/Storage"
  name                = "${local.service_name}ui${local.env_name}website"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  allowed_ips         = var.allowed_ips
  tags                = local.tags
  env_name            = local.env_name
  hub_n_spoke_subnet  = data.azurerm_subnet.hub_n_spoke_subnet.id
  agent_prd_subnet    = var.agent_prd_subnet
}
