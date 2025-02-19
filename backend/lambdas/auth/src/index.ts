import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const randomNumber = Math.floor(Math.random() * 10) + 1;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        number: randomNumber,
        timestamp: new Date().toISOString(),
        requestId: event.requestContext?.requestId || 'unknown'
      }),
    };
  } catch (error) {
    console.error(
      'Error processing request:',
      error instanceof Error ? error.message : String(error)
    );
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Internal server error',
        requestId: event.requestContext?.requestId || 'unknown',
      }),
    };
  }
};
