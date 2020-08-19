import Logger, { LoggerStructure } from "@zackheil/lambda-logger"

export default class LambdaHandler {

    private logger: LoggerStructure;
    constructor(logger: LoggerStructure) {
        this.logger = logger.child({ API: this.constructor.name });
    }

    public execute(message: string) {
        this.logger.info("starting %s", this.execute.name);
        let val = this.addEverybody(message);

        return {
            body: JSON.stringify({ message: val }),
            statusCode: 200,
        };
    }

    addEverybody(message: string): string {
        this.logger.info("starting %s", this.addEverybody.name);
        return this.logger.scope("Action", `${this.constructor.name}.${this.addEverybody.name}`, () => {
            this.logger.info("this is me trying something new!");
            return message + " Everybody!";
        });
    }
}
