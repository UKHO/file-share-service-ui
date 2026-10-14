terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.39.1"
    }
  }

  required_version = "=1.3.7"
  backend "azurerm" {
    container_name = "fss-ui-tfstate"
    key            = "terraform.deployment.tfplan"
  }
}

provider "azurerm" {
  features {}
}

provider "azurerm" {
  features {}
  alias = "build_agent"
  subscription_id = var.agent_subscription_id
}

provider "azurerm" {
  features {}
  alias           = "frontdoor"
  subscription_id = var.front_door_subscription_id != "" ? var.front_door_subscription_id : null
}
