import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoService } from './services/cognito';
import { LoginData, SignupData, VerifyEmailData, AuthError } from './types';
import { protectedHandler } from './handlers/protected';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://pge.dmitrygrinko.com',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '300',
};

const handleLogin = async (data: LoginData): Promise<APIGatewayProxyResult> => {
  try {
    const tokens = await CognitoService.login(data.email, data.password);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Login failed' 
      }),
    };
  }
};

const handleSignup = async (data: SignupData): Promise<APIGatewayProxyResult> => {
  try {
    await CognitoService.signUp(data.email, data.password);
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'User created. Please check your email for verification code.' 
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Signup failed' 
      }),
    };
  }
};

const handleVerifyEmail = async (data: VerifyEmailData): Promise<APIGatewayProxyResult> => {
  try {
    await CognitoService.verifyEmail(data.email, data.code);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Email verified successfully. You can now login.' 
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Verification failed' 
      }),
    };
  }
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handle OPTIONS requests
  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://pge.dmitrygrinko.com',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers'
      },
      body: ''
    };
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const path = event.path;
    const body = event.body ? JSON.parse(event.body) : {};

    switch (path) {
      case '/auth/login':
        return await handleLogin(body);
      case '/auth/signup':
        return await handleSignup(body);
      case '/auth/verify':
        return await handleVerifyEmail(body);
      case '/auth/me':
        return await protectedHandler(event);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Not Found' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Type guard for AuthError
    const isAuthError = (err: unknown): err is AuthError => {
      return err instanceof Error && 'code' in err;
    };

    // Handle known errors
    if (isAuthError(error)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: error.message,
          code: error.code
        })
      };
    }

    // Handle unexpected errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }
};
