import chalk from "chalk";

const { log } = console;

type TMethod = "GET" | "POST" | "PATCH";
type TFieldParams = {
    method: TMethod;
    body?: object;
    url: string;
    path?: string;
    query?: string;
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
        path,
        query,
    }: TFieldParams): void {
        log(
            ...[
                chalk.gray(timestamp.toISOString()),
                chalk.gray("[INFO]"),
                chalk.greenBright(method),
                chalk.yellowBright(url),
                body && JSON.stringify(body),
                path && JSON.stringify(path),
                query && JSON.stringify(query),
            ].filter(Boolean),
        );
    }

    static error({
        method,
        url,
        timestamp = new Date(),
        body,
        path,
        query,
    }: TFieldParams): void {
        log(
            ...[
                chalk.gray(timestamp.toISOString()),
                chalk.redBright("[ERROR]"),
                chalk.redBright(method),
                chalk.yellowBright(url),
                body && JSON.stringify(body),
                path && JSON.stringify(path),
                query && JSON.stringify(query),
            ].filter(Boolean),
        );
    }
}
