// Specify terraform version and providers
terraform {
  required_version = ">= 0.13"
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = "~> 1.12.0"
    }
  }
}

// Set config values as variables, defined in terraform.tfstate file
variable "ibmcloud_api_key" {}
variable "region" {}
variable "organization" {}
variable "space" {}

// Provide these credentials to the ibm provider to use
provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region           = var.region
}

// Create zip of backend code to be run on cloud foundry
resource "null_resource" "prepare_app_zip" {
  provisioner "local-exec" {
    command = "mkdir -p /tmp/app && cp -r backend /tmp/app && cd /tmp/app/backend && rm -r node_modules && zip -r /tmp/app.zip *"
  }
}
// Set up name space and orgination for project
data "ibm_space" "spacedata" {
  name = var.space
  org  = var.organization
}

// Create cloudant service instance
resource "ibm_service_instance" "service-instance" {
  name       = "cloudant-db"
  space_guid = data.ibm_space.spacedata.id
  service    = "cloudantNoSQLDB"
  plan       = "lite"
  tags       = ["cluster-service", "cluster-bind"]
}

// Create cloudant service key
resource "ibm_service_key" "serviceKey" {
  name                  = "mycloudantdbkey"
  service_instance_guid = ibm_service_instance.service-instance.id
}

// Set domain to be use by app route
data "ibm_app_domain_shared" "domain" {
  name = "eu-gb.mybluemix.net"
}

// Create route to be used from domain
resource "ibm_app_route" "route" {
  domain_guid = data.ibm_app_domain_shared.domain.id
  space_guid  = data.ibm_space.spacedata.id
  host        = "product-api"
}

// Spin up 1 instance of the app
resource "ibm_app" "app" {
  depends_on = [
    ibm_service_key.serviceKey,
    null_resource.prepare_app_zip
  ]
  name                  = "rest-api"
  space_guid            = data.ibm_space.spacedata.id
  app_path              = "/tmp/app.zip"
  wait_time_minutes     = 5
  buildpack             = ""
  memory                = 256
  instances             = 1
  disk_quota            = 512
  route_guid            = [ibm_app_route.route.id]
  service_instance_guid = [ibm_service_instance.service-instance.id]
  app_version           = "1"
  command               = "node app.js"
}
