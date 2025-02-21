import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  "Access-Control-Allow-Headers" : "Content-Type",
  'Access-Control-Allow-Credentials': 'true'
};

const handleInput = async (body: any) => {
  console.log("handleInput", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Input handled' })
  };
};

const handleUpload = async (body: any) => {
  console.log("handleUpload", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Upload handled' })
  };
};

const handleHistory = async (body: any) => {
  console.log("handleHistory", body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'History handled' })
  };
};

const handleSummary = async (body: any) => {
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

    console.log("body", body);

    switch (path) {
      case '/dev/energy/input':
        return await handleInput(body);
      case '/dev/energy/upload':
        return await handleUpload(body);
      case '/dev/energy/history':
        return await handleHistory(body);
      case '/dev/energy/summary':
        return await handleSummary(body);
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
