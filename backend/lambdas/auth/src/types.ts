export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData extends LoginData {
  name?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface AuthError extends Error {
  code?: string;
} 