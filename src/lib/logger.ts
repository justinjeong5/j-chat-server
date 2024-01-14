/* eslint-disable no-console */
import chalk from "chalk";
import { format } from "date-fns";
import { isEmpty } from "lodash";

type TFieldParams = {
    method: string;
    body?: object;
    url: string;
    query?: object;
    timestamp?: Date;
};

export default class Logger {
    static init(msg: string, timestamp = new Date()): void {
        console.log(
            ...[
                chalk.gray("[init]"),
                chalk.gray(format(timestamp, "hh:mm:ss")),
                chalk.gray(msg),
            ],
        );
    }

    static done(msg: string, timestamp = new Date()): void {
        console.log(
            ...[
                chalk.gray("[done]"),
                chalk.gray(format(timestamp, "hh:mm:ss")),
                chalk.greenBright(msg),
            ],
        );
    }

    static info({
        method,
        url,
        timestamp = new Date(),
        body,
        query,
    }: TFieldParams): void {
        console.log(
            ...[
                chalk.gray("[info]"),
                chalk.gray(format(timestamp, "hh:mm:ss")),
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
        console.log(
            ...[
                chalk.redBright("[error]"),
                chalk.gray(format(timestamp, "hh:mm:ss")),
                chalk.redBright(method),
                chalk.yellowBright(url),
                !isEmpty(body) && JSON.stringify(body),
                !isEmpty(query) && JSON.stringify(query),
            ].filter(Boolean),
        );
    }
}
