import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda';
import { CognitoService } from './services/cognito';
import { LoginData, SignupData, VerifyEmailData } from './types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  "Access-Control-Allow-Headers" : "Content-Type",
  'Access-Control-Allow-Credentials': 'true'
};

// Add cookie configuration
const cookieConfig = {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
};

const handleLogin = async (data: LoginData): Promise<APIGatewayProxyResultV2> => {
  try {
    const tokens = await CognitoService.login(data.email, data.password);
    const { refreshToken, ...otherTokens } = tokens;

    const headers = {
      ...corsHeaders,
      'Access-Control-Allow-Credentials': 'true',
      'Set-Cookie': `refreshToken=${refreshToken}; ${Object.entries(cookieConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(otherTokens)
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

const handleLogout = async (): Promise<APIGatewayProxyResultV2> => {
  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Credentials': 'true',
      'Set-Cookie': `refreshToken=; ${Object.entries({...cookieConfig, maxAge: 0})
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    },
    body: JSON.stringify({ message: 'Logged out successfully' })
  };
};

const handleRefreshToken = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    // Get refresh token from cookies
    const cookies = isV2Event(event) 
      ? (event.cookies || [])
      : (event.headers?.Cookie?.split(';') || []);

    const refreshToken = cookies
      .map(cookie => cookie.split(';')[0].trim())
      .find(cookie => cookie.startsWith('refreshToken='))
      ?.split('=')[1];

    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }

    const tokens = await CognitoService.refreshToken(refreshToken);
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(tokens)
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Token refresh failed' 
      })
    };
  }
};

// Type guard to check if event is V2
function isV2Event(event: APIGatewayProxyEvent | APIGatewayProxyEventV2): event is APIGatewayProxyEventV2 {
  return 'requestContext' in event && 'http' in event.requestContext;
}

export const handler = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult | APIGatewayProxyResultV2> => {

  // Determine HTTP method and path based on event version
  const httpMethod = isV2Event(event) 
    ? event.requestContext.http.method 
    : event.httpMethod;

  const path = isV2Event(event) 
    ? event.rawPath 
    : event.path;

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    switch (path) {
      case '/dev/auth/login':
        return await handleLogin(body);
      case '/dev/auth/signup':
        return await handleSignup(body);
      case '/dev/auth/verify':
        return await handleVerifyEmail(body);
      case '/dev/auth/refresh':
        return await handleRefreshToken(event);
      case '/dev/auth/logout':
        return await handleLogout();
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
