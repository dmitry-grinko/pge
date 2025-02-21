import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';
import jwt from 'jsonwebtoken';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

const TABLE_NAME = process.env.TABLE_NAME!;
// const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  "Access-Control-Allow-Headers" : "Content-Type",
  'Access-Control-Allow-Credentials': 'true'
};

interface EnergyInput {
  id: string;
  Date: string;
  Usage: number;
  Source: string;
  UserId: string | (() => string); // TODO: Fix type - string | (() => string) -> string
  TTL: number;
  CreatedAt: string;
}

// TODO: Fix type - string | (() => string) -> string
const handleInput = async (body: any, sub: string | (() => string)) => {  
  if (!body.date || !body.usage || !body.source || !sub) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Missing required fields: date, usage, source, idToken' })
    };
  }

  // Calculate TTL for 1 year from now
  const ttl = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

  const item: EnergyInput = {
    id: uuidv4(),
    Date: body.date,
    Usage: body.usage,
    Source: body.source,
    UserId: sub,
    TTL: ttl,
    CreatedAt: new Date().toISOString()
  };

  try {
    await ddbClient.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true })
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Energy data saved successfully',
        id: item.id
      })
    };
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Failed to save energy usage'
      })
    };
  }
};

const handleUpload = async (body: any, sub: string | (() => string)) => {
  console.log("handleUpload", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Upload handled' })
  };
};

const handleHistory = async (body: any, sub: string | (() => string)) => {
  console.log("handleHistory", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'History handled' })
  };
};

const handleSummary = async (body: any, sub: string | (() => string)) => {
  console.log("handleSummary", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Summary handled' })
  };
};

// Type guard to check if event is V2
function isV2Event(event: APIGatewayProxyEvent | APIGatewayProxyEventV2): event is APIGatewayProxyEventV2 {
  return 'requestContext' in event && 'http' in event.requestContext;
}

export const handler = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult | APIGatewayProxyResultV2> => {

  console.log("event", event);

  // Determine HTTP method and path based on event version
  const httpMethod = isV2Event(event) 
    ? event.requestContext.http.method 
    : event.httpMethod;

  console.log("httpMethod", httpMethod);

  const path = isV2Event(event) 
    ? event.rawPath 
    : event.path;
  
  console.log("path", path);

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    let idToken: string | undefined;
    let accessToken: string | undefined;

    try {
      idToken = event.headers['x-id-token'];
      accessToken = event.headers.authorization?.split(' ')[1];
    } catch (error) {
      console.error('Error parsing headers:', error);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid headers' })
      };
    }

    if (!idToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized. No ID token.' })
      };
    }

    const sub = jwt.decode(idToken, { complete: true })?.payload?.sub;

    if (!sub) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unauthorized. Invalid ID token.' })
      };
    }

    switch (path) {
      case '/dev/energy/input':
        return await handleInput(body, sub);
      case '/dev/energy/upload':
        return await handleUpload(body, sub);
      case '/dev/energy/history':
        return await handleHistory(body, sub);
      case '/dev/energy/summary':
        return await handleSummary(body, sub);
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
