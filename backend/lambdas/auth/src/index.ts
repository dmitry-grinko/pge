import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name?: string;
}

interface ForgotPasswordData {
  email: string;
}

const handleLogin = async (data: LoginData): Promise<APIGatewayProxyResult> => {
  // TODO: Implement actual login logic
  console.log('handleLogin', data);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ token: 'mocked-jwt-token' }),
  };
};

const handleSignup = async (data: SignupData): Promise<APIGatewayProxyResult> => {
  // TODO: Implement actual signup logic
  console.log('handleSignup', data);
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'User created' }),
  };
};

const handleForgotPassword = async (data: ForgotPasswordData): Promise<APIGatewayProxyResult> => {
  // TODO: Implement actual password reset logic
  console.log('handleForgotPassword', data);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'Reset link sent' }),
  };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { path, httpMethod, body } = event;
    console.log('handler', path, httpMethod, body);
    const data = JSON.parse(body || '{}');

    switch (true) {
      case path === '/auth/login' && httpMethod === 'POST':
        return await handleLogin(data);
      case path === '/auth/signup' && httpMethod === 'POST':
        return await handleSignup(data);
      case path === '/auth/forgot-password' && httpMethod === 'POST':
        return await handleForgotPassword(data);
      default:
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Error processing request:', error instanceof Error ? error.message : String(error));
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
