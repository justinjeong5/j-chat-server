import chalk from "chalk";
import { isEmpty } from "lodash";

const { log } = console;

type TFieldParams = {
    method: string;
    body?: object;
    url: string;
    query?: object;
    timestamp?: Date;
};

export default class Logger {
    static init(msg: string): void {
        log(chalk.gray("[INIT]"), chalk.gray(msg));
    }

    static done(msg: string): void {
        log(chalk.gray("[DONE]"), chalk.greenBright(msg));
    }

    static info({
        method,
        url,
        timestamp = new Date(),
        body,
        query,
    }: TFieldParams): void {
        log(
            ...[
                chalk.gray(timestamp.toISOString()),
                chalk.gray("[INFO]"),
                chalk.greenBright(method),
                chalk.yellowBright(url),
                !isEmpty(body) && JSON.stringify(body),
                !isEmpty(query) && JSON.stringify(query),
            ].filter(Boolean),
        );
    }

    static error({
        method,
        url,
        timestamp = new Date(),
        body,
        query,
    }: TFieldParams): void {
        log(
            ...[
                chalk.gray(timestamp.toISOString()),
                chalk.redBright("[ERROR]"),
                chalk.redBright(method),
                chalk.yellowBright(url),
                !isEmpty(body) && JSON.stringify(body),
                !isEmpty(query) && JSON.stringify(query),
            ].filter(Boolean),
        );
    }
}
