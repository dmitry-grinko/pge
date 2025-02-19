variable "name" {
  type        = string
  description = "Name of the API Gateway"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "lambda_function_arn" {
  type        = string
  description = "ARN of the Lambda function to integrate with"
}

variable "lambda_function_name" {
  type        = string
  description = "Name of the Lambda function"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to resources"
} 