resource "aws_dynamodb_table" "usage_table" {
  name           = var.table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"  # String type for unique ID
  }

  attribute {
    name = "Date"
    type = "S"  # String type for date in format YYYY-MM-DD
  }

  # Global Secondary Index for Date field to enable querying by date
  global_secondary_index {
    name               = "DateIndex"
    hash_key           = "Date"
    projection_type    = "ALL"
  }

  # Adding TTL for data retention
  ttl {
    attribute_name = "TTL"
    enabled        = true
  }

  tags = var.tags
}
