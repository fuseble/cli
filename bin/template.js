"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const yargs = require("yargs");
const chalk = require("chalk");
const utils_1 = require("./utils");
class TemplateCLI {
    constructor() { }
    static getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield yargs.usage(chalk.cyan(``)).options({
                stack: {
                    alias: "s",
                    describe: "Stack to use",
                    type: "string",
                },
                template: {
                    alias: "t",
                    describe: "Template to use",
                    type: "string",
                },
                name: {
                    alias: "n",
                    describe: "Name of the project",
                    type: "string",
                    default: "outqource-template",
                },
                branch: {
                    alias: "b",
                    describe: "Branch to use",
                    type: "string",
                    default: "dev",
                },
                print: {
                    alias: "p",
                    describe: "Print template info",
                    type: "boolean",
                    default: false,
                },
            }).argv;
            if (!options.print && (!options.stack || !options.template)) {
                console.log(`Please provide a template and stack`);
                process.exit(1);
            }
            if (options.print) {
                yield this.printTemplateInfo();
                process.exit(0);
            }
            return options;
        });
    }
    static getTemplateInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = "https://raw.githubusercontent.com/fuseble/template/main/cli.json";
                const { data } = yield axios_1.default.get(url);
                return data;
            }
            catch (error) {
                return null;
            }
        });
    }
    static printTemplateInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const templateInfo = (yield this.getTemplateInfos());
            if (!templateInfo)
                return null;
            Object.entries(templateInfo).forEach(([stack, templates], index) => {
                console.log(`  ${index + 1}: ${stack}`);
                templates.forEach((template) => {
                    console.log(`    - ${template}`);
                });
            });
            return true;
        });
    }
    static cloneTemplate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [path, newPath] = (() => {
                    const pathArray = [options.name, options.stack, options.template];
                    return [pathArray.join("/"), pathArray.join("-")];
                })();
                (0, utils_1.getSubdirectoryFromGithub)({
                    orgainzation: "fuseble",
                    repository: "template",
                    projectName: options.name,
                    branch: options.branch,
                    src: path,
                    dest: newPath,
                });
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
}
exports.default = TemplateCLI;
