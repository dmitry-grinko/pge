import { 
  CognitoJwtVerifier, 
  CognitoJwtPayload 
} from "@aws-jwt-verify/cognito-jwt-verifier";
import { APIGatewayProxyEvent } from 'aws-lambda';

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

const verifier = new CognitoJwtVerifier({
  userPoolId: USER_POOL_ID,
  clientId: CLIENT_ID,
  tokenUse: "access",
});

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user?: {
    sub: string;
    email: string;
    // Add other claims you need
  };
}

export async function validateToken(event: APIGatewayProxyEvent): Promise<AuthenticatedEvent> {
  const auth = event.headers.Authorization || event.headers.authorization;
  if (!auth) {
    throw new Error('No authorization header');
  }

  const token = auth.replace('Bearer ', '');
  try {
    const payload = await verifier.verify(token) as CognitoJwtPayload;
    return {
      ...event,
      user: {
        sub: payload.sub,
        email: payload['email'],
      },
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
} 