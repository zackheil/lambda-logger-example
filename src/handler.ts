import Logger, { LogLevel, Stream, JSONFormatter } from '@zackheil/lambda-logger';
import CustomFormatter from './CustomFormatter';
import fs from 'fs';
// import LinearFormatter from './LinearFormatter';
import LambdaHandler from './LambdaHandler';


// .setFormatter(new CustomFormatter())
const log = new Logger();
const lambdaHandler = new LambdaHandler(log.child({ type: "LambdaHelper" }));


export async function stdLogger(event: any, context: any) {
    // process.env.AWS_REQUEST_ID = context.awsRequestId;
    
    return lambdaHandler.execute("Hello");
}

export async function otherLogger(event: any, context: any) {
    // process.env.AWS_REQUEST_ID = context.awsRequestId;
    // log.info("starting %s", "otherLogger");
    // let result = lambdaHandler.execute("Hello");
    // log.info("the handler has finished processing the request");
    // return result;

    process.env.AWS_REQUEST_ID = context.awsRequestId; // enables log tracking


    // const log = new Logger();
    log.info("this log will be formatted in JSON");
    return {
        body: JSON.stringify({ message: "val" }),
        statusCode: 200,
    };
}