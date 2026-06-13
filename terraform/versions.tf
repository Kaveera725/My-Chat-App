terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Recommended: store state remotely (uncomment and configure once you have a bucket).
  # backend "s3" {
  #   bucket = "swifttalk-tfstate"
  #   key    = "global/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}
