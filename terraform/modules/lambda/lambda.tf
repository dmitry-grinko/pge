# Lambda function
resource "aws_lambda_function" "function" {
  function_name = var.function_name
  role         = aws_iam_role.lambda_role.arn
  handler      = var.handler
  runtime      = var.runtime
  
  filename         = var.filename
  source_code_hash = fileexists(var.filename) ? filebase64sha256(var.filename) : null
  package_type     = "Zip"

  tags = var.tags
}