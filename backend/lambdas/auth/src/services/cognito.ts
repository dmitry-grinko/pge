import { 
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthError, CognitoTokens } from '../types';

const cognitoClient = new CognitoIdentityProviderClient({});

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

console.log('USER_POOL_ID', USER_POOL_ID);
console.log('CLIENT_ID', CLIENT_ID);

if (!USER_POOL_ID || !CLIENT_ID) {
  throw new Error('COGNITO_USER_POOL_ID or COGNITO_CLIENT_ID is not set');
}

export class CognitoService {
  static async signUp(email: string, password: string): Promise<void> {
    try {
      await cognitoClient.send(
        new SignUpCommand({
          ClientId: CLIENT_ID,
          Username: email,
          Password: password,
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
          ],
        })
      );
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'UsernameExistsException') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  static async verifyEmail(email: string, code: string): Promise<void> {
    try {
      await cognitoClient.send(
        new ConfirmSignUpCommand({
          ClientId: CLIENT_ID,
          Username: email,
          ConfirmationCode: code,
        })
      );
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'CodeMismatchException') {
        throw new Error('Invalid verification code');
      }
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<CognitoTokens> {
    try {
      const response = await cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          ClientId: CLIENT_ID,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        })
      );

      const result = response.AuthenticationResult;
      if (!result?.AccessToken || !result.IdToken || !result.RefreshToken) {
        throw new Error('Invalid authentication result');
      }

      return {
        accessToken: result.AccessToken,
        idToken: result.IdToken,
        refreshToken: result.RefreshToken,
      };
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'NotAuthorizedException') {
        throw new Error('Invalid credentials');
      }
      if (authError.code === 'UserNotConfirmedException') {
        throw new Error('Please verify your email first');
      }
      throw error;
    }
  }
} 