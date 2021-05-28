module "storage" {
  source              = "./Modules/Storage"
  name                = "${local.service_name}ui${local.env_name}website"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  tags                = local.tags
  env_name            = local.env_name
}

