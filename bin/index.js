#! /usr/bin/env node
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.DEBUG = 'cli:*';
var openapi_1 = __importDefault(require("./openapi"));
var terraform_1 = __importDefault(require("./terraform"));
var template_1 = __importDefault(require("./template"));
var github_1 = __importDefault(require("./github"));
var prisma_1 = __importDefault(require("./prisma"));
var CLI_COMMANDS = ['template', 'openapi', 'terraform', 'prisma', 'github'];
var CLI = /** @class */ (function () {
    function CLI() {
        this.validateCommand();
        this.getOptions().then();
    }
    CLI.prototype.validateCommand = function () {
        var args = process.argv.slice(2);
        if (args.length === 0) {
            console.log("No command provided");
            process.exit(1);
        }
        if (!args.some(function (arg) { return CLI_COMMANDS.includes(arg); })) {
            console.log("Invalid command provided: command types ".concat(CLI_COMMANDS.join(', ')));
            process.exit(1);
        }
        this.command = CLI_COMMANDS.find(function (command) { return args.includes(command); });
    };
    CLI.prototype.getOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = {};
                        _a = this.command;
                        switch (_a) {
                            case 'template': return [3 /*break*/, 1];
                            case 'openapi': return [3 /*break*/, 3];
                            case 'terraform': return [3 /*break*/, 5];
                            case 'prisma': return [3 /*break*/, 7];
                            case 'github': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 13];
                    case 1: return [4 /*yield*/, template_1.default.init()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 3: return [4 /*yield*/, openapi_1.default.init()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 5: return [4 /*yield*/, terraform_1.default.init()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 7: return [4 /*yield*/, prisma_1.default.getOptions()];
                    case 8:
                        options = _b.sent();
                        return [4 /*yield*/, prisma_1.default.writePrismaSchema(options)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 10: return [4 /*yield*/, github_1.default.getOptions()];
                    case 11:
                        options = _b.sent();
                        return [4 /*yield*/, github_1.default.commits(options)];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        console.log("Invalid command provided");
                        process.exit(1);
                        _b.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    return CLI;
}());
new CLI();
