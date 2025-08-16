import chalk from 'chalk';

export const logger = {
  info: (tag: string, message: string) =>
    console.log(`${chalk.blue.bold(`[${tag}]`)} ${chalk.gray(message)}`),
  warn: (tag: string, message: string) =>
    console.warn(`${chalk.yellow.bold(`[${tag}]`)} ${chalk.gray(message)}`),
  error: (tag: string, message: string) =>
    console.error(`${chalk.red.bold(`[${tag}]`)} ${chalk.gray(message)}`),
};
