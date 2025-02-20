resource "aws_cognito_user_pool" "main" {
  name = "user-pool"

  # Use email as the only way to sign in
  username_attributes = ["email"]
  
  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # Email verification
  auto_verified_attributes = ["email"]
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "Verify your email"
    email_message = "Thanks for signing up! Your verification code is {####}"
  }

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
}

# Client app configuration for your Lambda backend
resource "aws_cognito_user_pool_client" "client" {
  name         = "backend-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # No client secret needed since we're using AWS SDK in Lambda
  generate_secret = false

  # Only enable the auth flows we need
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  # Token validity settings
  token_validity_units {
    access_token  = "hours"
    id_token     = "hours"
    refresh_token = "days"
  }

  access_token_validity = 1  # 1 hour
  id_token_validity = 1      # 1 hour
  refresh_token_validity = 30 # 30 days

  prevent_user_existence_errors = "ENABLED"
}

# Outputs
output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.main.arn
}
