locals {
  tags = {
    Environment = var.environment
  }
}

data "aws_acm_certificate" "existing" {
  domain      = var.root-domain
  statuses    = ["ISSUED"]
  most_recent = true
}

data "aws_route53_zone" "main" {
  name = var.root-domain
}

module "waf" {
  source             = "./modules/waf"
  waf_name           = "my-waf"
  waf_description    = "My WAF for the application"
  ip_set_name        = "blocked-ips"
  ip_set_description = "IP set for blocking specific IPs"
  blocked_ips        = ["192.0.2.0/32", "203.0.113.0/32"] # Replace with your IPs
}

module "cloudfront" {
  source                      = "./modules/cloud-front"
  website_domain              = "${var.subdomain-name}.${var.root-domain}"
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  acm_certificate_arn         = data.aws_acm_certificate.existing.arn
  waf_arn                     = module.waf.waf_arn
  tags = {
    Environment = var.environment
  }
  depends_on = [module.waf]
}

module "s3" {
  source = "./modules/s3"

  bucket_name            = var.bucket-name
  environment            = var.environment
  cloudfront_oai_iam_arn = module.cloudfront.cloudfront_oai_iam_arn
}

resource "aws_route53_record" "static_website" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${var.subdomain-name}.${var.root-domain}"
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}