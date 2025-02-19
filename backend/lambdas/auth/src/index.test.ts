import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from './index';
import { describe, it, expect } from '@jest/globals';

describe('Auth Lambda Handler', () => {
  const mockHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  describe('Login Endpoint', () => {
    it('should handle login request successfully', async () => {
      const mockEvent = {
        path: '/auth/login',
        httpMethod: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      } as APIGatewayProxyEvent;

      const response = await handler(mockEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual(mockHeaders);
      expect(body).toHaveProperty('token');
    });
  });

  describe('Signup Endpoint', () => {
    it('should handle signup request successfully', async () => {
      const mockEvent = {
        path: '/auth/signup',
        httpMethod: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
      } as APIGatewayProxyEvent;

      const response = await handler(mockEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(201);
      expect(response.headers).toEqual(mockHeaders);
      expect(body).toHaveProperty('message', 'User created');
    });
  });

  describe('Forgot Password Endpoint', () => {
    it('should handle forgot password request successfully', async () => {
      const mockEvent = {
        path: '/auth/forgot-password',
        httpMethod: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        })
      } as APIGatewayProxyEvent;

      const response = await handler(mockEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual(mockHeaders);
      expect(body).toHaveProperty('message', 'Reset link sent');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const mockEvent = {
        path: '/unknown',
        httpMethod: 'GET',
      } as APIGatewayProxyEvent;

      const response = await handler(mockEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(404);
      expect(response.headers).toEqual(mockHeaders);
      expect(body).toHaveProperty('message', 'Not found');
    });

    it('should handle invalid JSON in body', async () => {
      const mockEvent = {
        path: '/login',
        httpMethod: 'POST',
        body: 'invalid-json'
      } as APIGatewayProxyEvent;

      const response = await handler(mockEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(500);
      expect(response.headers).toEqual(mockHeaders);
      expect(body).toHaveProperty('message', 'Internal server error');
    });
  });
});
