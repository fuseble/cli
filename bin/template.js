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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var yargs = require("yargs");
var chalk = require("chalk");
var utils_1 = require("./utils");
var TemplateCLI = /** @class */ (function () {
    function TemplateCLI() {
    }
    TemplateCLI.getOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, yargs.usage(chalk.cyan("")).options({
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
                        }).argv];
                    case 1:
                        options = _a.sent();
                        if (!options.print && (!options.stack || !options.template)) {
                            console.log("Please provide a template and stack");
                            process.exit(1);
                        }
                        if (!options.print) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.printTemplateInfo()];
                    case 2:
                        _a.sent();
                        process.exit(0);
                        _a.label = 3;
                    case 3: return [2 /*return*/, options];
                }
            });
        });
    };
    TemplateCLI.getTemplateInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = "https://raw.githubusercontent.com/fuseble/template/main/cli.json";
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TemplateCLI.printTemplateInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var templateInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTemplateInfos()];
                    case 1:
                        templateInfo = (_a.sent());
                        if (!templateInfo)
                            return [2 /*return*/, null];
                        Object.entries(templateInfo).forEach(function (_a, index) {
                            var stack = _a[0], templates = _a[1];
                            console.log("  ".concat(index + 1, ": ").concat(stack));
                            templates.forEach(function (template) {
                                console.log("    - ".concat(template));
                            });
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    };
    TemplateCLI.cloneTemplate = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, path, newPath;
            return __generator(this, function (_b) {
                try {
                    _a = (function () {
                        var pathArray = [options.name, options.stack, options.template];
                        return [pathArray.join("/"), pathArray.join("-")];
                    })(), path = _a[0], newPath = _a[1];
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
                return [2 /*return*/];
            });
        });
    };
    return TemplateCLI;
}());
exports.default = TemplateCLI;
