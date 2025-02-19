resource "aws_apigatewayv2_api" "main" {
  name          = var.name
  protocol_type = "HTTP"
  tags = var.tags
}

resource "aws_apigatewayv2_stage" "main" {
  api_id = aws_apigatewayv2_api.main.id
  name   = var.environment
  auto_deploy = true
  tags = var.tags
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id = aws_apigatewayv2_api.main.id
  
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = var.lambda_function_arn
}

resource "aws_apigatewayv2_route" "login" {
  api_id = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/login"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "signup" {
  api_id = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/signup"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "forgot_password" {
  api_id = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/forgot-password"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
} 