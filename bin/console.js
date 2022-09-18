"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
console = Object.assign(Object.assign({}, console), { red: (...props) => console.log(chalk.red(props)), cyan: (...props) => console.log(chalk.cyan(props)) });
