import Logger, { LoggerStructure } from "@zackheil/lambda-logger"

export default class LambdaHandler {

    private logger: LoggerStructure;
    constructor(logger: LoggerStructure) {
        this.logger = logger || new Logger();
    }

    public execute(message: string) {
        this.logger.info("starting %s", this.execute.name);
        let val = this.foo(message);

        return {
            body: JSON.stringify({ message: val }),
            statusCode: 200,
        };
    }

    foo(message: string): string {
        return this.logger.scope("Action", `${this.constructor.name}.${this.foo.name}`, () => {
            this.logger.warn("this is me trying something new!");
            return message + "s";
        });
    }
}
