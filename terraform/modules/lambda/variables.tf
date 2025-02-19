variable "function_name" {
  type        = string
  description = "Name of the Lambda function"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "runtime" {
  type        = string
  description = "Runtime for Lambda function"
}

variable "handler" {
  type        = string
  description = "Handler for Lambda function"
}

variable "log_retention_days" {
  type        = number
  description = "Number of days to retain CloudWatch logs"
}

variable "filename" {
  type        = string
  description = "Path to the Lambda deployment package"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to resources"
}