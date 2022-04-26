import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import middy from '@middy/core';
export declare const handler: middy.MiddyfiedHandler<APIGatewayProxyEvent, any, Error, Context>;
