import { LogFormatterStructure, LogEvent, Stream, LogLevel } from "@zackheil/lambda-logger";
import { format } from "util";

export default class CustomFormatter implements LogFormatterStructure {
    format(event: LogEvent, outputStreams: Stream[]) {
        for (const s of outputStreams) {
            const output = event.level >= 3 ? s.errorStream : s.outputStream;


            output.write(JSON.stringify(event, null, 2));
            output.write("\n");
        }
    }
}

