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
require("./console");
const template_1 = require("./template");
const openapi_1 = require("./openapi");
const CLI_COMMANDS = ["template", "openapi"];
class CLI {
    constructor() {
        this.validateCommand();
        this.getOptions().then();
    }
    validateCommand() {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.log(`No command provided`);
            process.exit(1);
        }
        if (!CLI_COMMANDS.includes(args[0])) {
            console.log(`Invalid command provided`);
            process.exit(1);
        }
        this.command = args[0];
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {};
            switch (this.command) {
                case "template":
                    options = yield template_1.default.getOptions();
                    yield template_1.default.cloneTemplate(options);
                    break;
                case "openapi":
                    yield openapi_1.default.writeOpenAPIFunctions();
                    break;
                default:
                    console.log(`Invalid command provided`);
                    process.exit(1);
            }
        });
    }
}
new CLI();
