terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.67.0"
    }
  }

  required_version = "=1.0.2"
  backend "azurerm" {
    container_name = "fss-ui-tfstate"
    key            = "terraform.deployment.tfplan"
  }
}

provider "azurerm" {
  features {}
}
