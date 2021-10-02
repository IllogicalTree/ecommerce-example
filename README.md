# Ecommerce example

This is an example project for a full-stack ecommerce project for a fictional store.

## Tech stack

Cloudant database
Express REST API on cloud foundry
Vue frontend planned

## Usage

Docs WIP

Install ibmcloud cli tools to get an api key (or via web interface)

Copy the 'terraform.example.tfstate' file to 'terraform.tfstate', adding your api key and desired region.

The cloud resources can be quickly deployed using terraform as follows;

First step is to initialise terraform, this will install the ibm provider etc
``` 
terraform init
```

This will present you with a list of resources that will be made on your cloud account.
```
terraform plan
```

If you have confirmed you are happy with the plan, apply the changes to create everything specified
```
terraform apply
```

If you are done with the project, you can use this to cleanup everything previously created.
```
terraform destroy
```

TODO add frontend deployment to terraform script

## Known issues

- Running terraform destroy fails to remove the Cloudant database instance, this will need to be removed manually until the issue has been resolved.
- Requires zip to be installed, so will probably want to run on linux
