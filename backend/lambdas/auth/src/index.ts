import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoService } from './services/cognito';
import { LoginData, SignupData, VerifyEmailData } from './types';
import { protectedHandler } from './handlers/protected';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
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
  try {
    const { path, httpMethod, body } = event;
    const data = JSON.parse(body || '{}');

    switch (true) {
      case path === '/auth/login' && httpMethod === 'POST':
        return await handleLogin(data);
      case path === '/auth/signup' && httpMethod === 'POST':
        return await handleSignup(data);
      case path === '/auth/verify' && httpMethod === 'POST':
        return await handleVerifyEmail(data);
      case path === '/auth/me' && httpMethod === 'GET':
        return await protectedHandler(event);
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
