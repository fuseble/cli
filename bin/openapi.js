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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPatch = exports.createDelete = exports.createPut = exports.createPost = void 0;
var axios_1 = __importDefault(require("axios"));
var yargs_1 = __importDefault(require("yargs"));
var chalk_1 = __importDefault(require("chalk"));
var camelcase_1 = __importDefault(require("camelcase"));
var fs_1 = __importDefault(require("fs"));
var createAxiosClient = function (urls) { return "\nimport axios from 'axios';\nimport qs from 'qs';\n\nconst apiClient = axios.create({\n  baseURL: '".concat(urls[0], "',\n  timeout: 1000 * 5,\n});\n"); };
var getApiFunctionName = function (method, url) {
    var splitUrl = url.split("/").map(function (part) {
        if (part.includes("{") && part.includes("}")) {
            var param = part.replace("{", "").replace("}", "");
            return param;
        }
        return part;
    });
    return (0, camelcase_1.default)(__spreadArray([method], splitUrl, true));
};
var getApiUrlParams = function (url) {
    return url
        .split("/")
        .map(function (part) {
        if (part.includes("{") && part.includes("}")) {
            var param = part.replace("{", "").replace("}", "");
            return param;
        }
        return undefined;
    })
        .filter(Boolean);
};
var getAPI = function (method, url) {
    var functionName = getApiFunctionName(method, url);
    var apiUrlParams = getApiUrlParams(url);
    var apiUrl = url.replace(/{/g, "${params.").replace(/}/g, "}");
    return { functionName: functionName, apiUrl: apiUrl };
};
var createGet = function (url) {
    var _a = getAPI("get", url), functionName = _a.functionName, apiUrl = _a.apiUrl;
    return "\nexport const ".concat(functionName, " = async (params: any) => {\n  const { data } = await apiClient.get(`").concat(apiUrl, "`, { params });\n  return data;\n};\n  ");
};
var createPost = function (url) {
    var _a = getAPI("post", url), functionName = _a.functionName, apiUrl = _a.apiUrl;
    return "\nexport const ".concat(functionName, " = async (params: any) => {\n  const { data } = await apiClient.post(`").concat(apiUrl, "`, params);\n  return data;\n};\n  ");
};
exports.createPost = createPost;
var createPut = function (url) {
    var _a = getAPI("put", url), functionName = _a.functionName, apiUrl = _a.apiUrl;
    return "\nexport const ".concat(functionName, " = async (params: any) => {\n  const { data } = await apiClient.put(`").concat(apiUrl, "`, params);\n  return data;\n};\n  ");
};
exports.createPut = createPut;
var createDelete = function (url) {
    var _a = getAPI("delete", url), functionName = _a.functionName, apiUrl = _a.apiUrl;
    return "\nexport const ".concat(functionName, " = async (params: any) => {\n  const { data } = await apiClient.delete(`").concat(apiUrl, "`, { params });\n  return data;\n};\n  ");
};
exports.createDelete = createDelete;
var createPatch = function (url) {
    var _a = getAPI("patch", url), functionName = _a.functionName, apiUrl = _a.apiUrl;
    return "\nexport const ".concat(functionName, " = async (params: any) => {\n  const { data } = await apiClient.patch(`").concat(apiUrl, "`, params);\n  return data;\n};\n  ");
};
exports.createPatch = createPatch;
var OpenAPICLI = /** @class */ (function () {
    function OpenAPICLI() {
    }
    OpenAPICLI.getOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, yargs_1.default.usage(chalk_1.default.cyan("")).options({
                            url: {
                                alias: "u",
                                describe: "URL of the OpenAPI",
                                type: "string",
                                requiresArg: true,
                            },
                            path: {
                                alias: "p",
                                describe: "Path to write the OpenAPI functions",
                                type: "string",
                                default: "./service.ts",
                            },
                        }).argv];
                    case 1:
                        options = _a.sent();
                        return [2 /*return*/, options];
                }
            });
        });
    };
    OpenAPICLI.getOpenAPI = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!url) {
                            console.log("Please provide a URL");
                            process.exit(1);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        e = error_1;
                        console.error("Error fetching OpenAPI");
                        process.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenAPICLI.parseOpenAPI = function (openapi) {
        var initApiClient = createAxiosClient(openapi.servers.map(function (server) { return server.url; }));
        var functions = Object.entries(openapi.paths).reduce(function (acc, _a) {
            var path = _a[0], attribute = _a[1];
            Object.entries(attribute).forEach(function (_a) {
                var method = _a[0], value = _a[1];
                switch (method) {
                    case "get":
                        acc += createGet(path);
                        break;
                    case "post":
                        acc += (0, exports.createPost)(path);
                        break;
                    case "put":
                        acc += (0, exports.createPut)(path);
                        break;
                    case "delete":
                        acc += (0, exports.createDelete)(path);
                        break;
                    case "patch":
                        acc += (0, exports.createPatch)(path);
                        break;
                }
            });
            return acc;
        }, "");
        return "".concat(initApiClient).concat(functions);
    };
    OpenAPICLI.writeOpenAPIFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, openapi, functions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOptions()];
                    case 1:
                        options = _a.sent();
                        return [4 /*yield*/, this.getOpenAPI(options.url)];
                    case 2:
                        openapi = _a.sent();
                        functions = this.parseOpenAPI(openapi);
                        fs_1.default.writeFile("".concat(options.path) || "./service.ts", functions, function (err) {
                            if (err) {
                                console.log(err);
                                process.exit(1);
                            }
                            console.log("OpenAPI functions written to ".concat(options.path));
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return OpenAPICLI;
}());
exports.default = OpenAPICLI;
