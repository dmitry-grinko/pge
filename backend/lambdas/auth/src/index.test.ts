import { APIGatewayEvent } from 'aws-lambda';
import { handler } from './index';
import { describe, it, expect } from '@jest/globals';

describe('Lambda Handler', () => {
  it('should return a valid health check response', async () => {
    // Mock API Gateway event
    const mockEvent = {
      requestContext: {
        requestId: 'test-request-id-123'
      }
    } as APIGatewayEvent;

    // Call the handler
    const response = await handler(mockEvent);
    
    // Parse the response body
    const body = JSON.parse(response.body);

    // Verify the response structure
    expect(body).toHaveProperty('number');
    expect(body.number).toBeGreaterThanOrEqual(1);
    expect(body.number).toBeLessThanOrEqual(10);
    expect(Number.isInteger(body.number)).toBe(true);
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('requestId', 'test-request-id-123');

    // Verify timestamp is a valid ISO string
    expect(() => new Date(body.timestamp)).not.toThrow();
  });
});
