
variable "resource_group_name" {
  type = string
}

variable "name" {
  type  = string
}

variable "location" {
  type = string
}

variable "env_name" {
  type  = string
}

variable "tags" {
}

variable "allowed_ips" {

}
 variable "hub_n_spoke_subnet" {
  type = string
}

variable "agent_subnet" {
  type = string
}