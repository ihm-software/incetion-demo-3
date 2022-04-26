import { Context } from 'aws-lambda';
export declare type ResponseBuilderResponse = {
    statusCode: number;
    body: {
        message: string;
        functionName: string;
        results: unknown[] | undefined;
    };
};
export declare type ResponseBuilder = {
    getResponse: (statusCode: number, msg: string, results?: unknown[] | undefined) => ResponseBuilderResponse;
};
export declare const getResponseBuilder: (context: Context) => {
    getResponse: (statusCode: number, msg: string, results?: unknown[] | undefined) => {
        statusCode: number;
        body: string;
    };
};
