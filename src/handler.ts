import Logger, { LogLevel, Stream, JSONFormatter } from '@zackheil/lambda-logger';
import EverythingFormatter from './EverythingFormatter';
import LambdaHandler from './LambdaHandler';


// For the entire example, the log level is set to INFO via the serverless.yml file
// This is a globally established JSON formatted logger that is cached in Lambda until the next cold start
const log1 = new Logger().setFormatter(new JSONFormatter());
const lambdaHandler1 = new LambdaHandler(log1);

// This is a globally established line formatted logger that is cached in Lambda until the next cold start
const log2 = new Logger();
const lambdaHandler2 = new LambdaHandler(log2);

/** Basic example of the logger functionality with a JSON formatter. Learn how to use scopes for blocks, classes, and globally!
 */
export async function exampleOne(event: any, context: any) {
    process.env.AWS_REQUEST_ID = context.awsRequestId;

    // log1.trace(JSON.stringify(event));
    log1.info("This is a basic function that is going to call a method of the lambda handler instance");

    log1.scope("check_this_out", "I can add a key-value pair to this portion of the logs!", () => {

        log1.info("every log I make in this scope will have this property attached (with the JSON formatter)");
        log1.info("see?");

    })

    log1.asyncScope("also", "this also works for an async function", async () => {

        log1.info("in case you have await expressions or promise-returning function, you can use this scope.");

        await 5; // this is pointless, but you get the picture ;)

        log1.info("for performance reasons, do not use this async scope for non-async applications!")
    });

    log1.scope("last_scope", "Last demo of scopes, I promise!", () => {
        log1.scope("last_last_scope", "I lied... here's the last one", () => {
            log1.info("just kidding, here's another scope... just nested within another");
            log1.addLogProperty("SPECIAL", "this lets me add a static property to logs. All logs will have this and ignore scope.")
            log1.info("what did that above line do in practice?");
        });
    });
    
    log1.info("see... the SPECIAL property exists still...");

    log1.removeLogProperty("SPECIAL");
    log1.info("That's better! Lets run that class instance now to see the properties now used with a child logger as a scope.");



    return lambdaHandler1.execute("Hello");
}

/** With this one, we using a linear formatter to just demonstrate how to censor data.
 */
export async function exampleTwo(event: any, context: any) {

    log2.info("this log will be formatted in the default line format");

    log2.info("now that that is out of the way, let's discuss secrets:")

    let secret: any = "you'll never know";

    log2.info("wanna know a secret: " + log2.mask(secret));

    secret = "";

    log2.info("of course, if the variable in question is blank, that would be good to know: " + log2.mask(secret));

    secret = undefined;

    log2.info("same thing for undefined... that would be good to know: " + log2.mask(secret));

    log2.info("if you're trying to mask customer data but want to ensure your test values are coming through,");
    log2.info("you can MD5 hash your test values and see if they match the hash mask that appears in your logs.");

    return {
        body: JSON.stringify({ message: "This is a message... no handler class" }),
        statusCode: 200,
    };
}

/** With this one, we just print a few log so you can see what data each log contains.
 */
export async function exampleThree(event: any, context: any) {
    
    // You'll notice in the logs that the default name of the logger is the name of the function
    // IF the logger is defined within the handler.
    const l = new Logger().setFormatter(new EverythingFormatter());

    l.info("this is a message");

    l.scope("property_key", "property_value", () => {
        l.info("this is a message with a log property")
    });

    process.env.AWS_REQUEST_ID = context.awsRequestId;

    l.info("now we are tracking the requestID, so there are additional properties in the log object");

    l.info("Let's finish this off with a %s", "demonstration of a util.format string and how it is stored");

    return {
        body: JSON.stringify({ message: "This is a message... no handler class" }),
        statusCode: 200,
    };
}
