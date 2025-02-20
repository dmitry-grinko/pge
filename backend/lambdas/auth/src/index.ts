import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { CognitoService } from './services/cognito';
import { LoginData, SignupData, VerifyEmailData } from './types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

const handleLogin = async (data: LoginData): Promise<APIGatewayProxyResultV2> => {
  try {
    const tokens = await CognitoService.login(data.email, data.password);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tokens)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Login failed' 
      })
    };
  }
};

const handleSignup = async (data: SignupData): Promise<APIGatewayProxyResultV2> => {
  try {
    await CognitoService.signUp(data.email, data.password);
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'User created. Please check your email for verification code.' 
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Signup failed' 
      })
    };
  }
};

const handleVerifyEmail = async (data: VerifyEmailData): Promise<APIGatewayProxyResultV2> => {
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

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http.method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    switch (event.rawPath) {
      case '/auth/login':
        return await handleLogin(body);
      case '/auth/signup':
        return await handleSignup(body);
      case '/auth/verify':
        return await handleVerifyEmail(body);
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Not Found' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal Server Error'
      })
    };
  }
};
