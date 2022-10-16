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
var yargs_1 = __importDefault(require("yargs"));
var chalk_1 = __importDefault(require("chalk"));
var flat_1 = require("flat");
var fs_extra_1 = __importDefault(require("fs-extra"));
var ecs_fargate_json_1 = __importDefault(require("./config/origin.tfvars.json/ecs-fargate.json"));
var s3_web_json_1 = __importDefault(require("./config/origin.tfvars.json/s3-web.json"));
var TerraformCLI = /** @class */ (function () {
    function TerraformCLI() {
    }
    TerraformCLI.getOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var templateOptions, options, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, yargs_1.default.usage(chalk_1.default.cyan("")).options({
                            template: {
                                alias: "template",
                                type: "string",
                                requiresArg: true,
                            },
                        }).argv];
                    case 1:
                        templateOptions = _a.sent();
                        if (!(templateOptions.template === "ecs-fargate")) return [3 /*break*/, 3];
                        return [4 /*yield*/, yargs_1.default
                                .usage(chalk_1.default.cyan("ECS Fargate Options"))
                                .options({
                                template: {
                                    type: "string",
                                    requiresArg: true,
                                },
                                profile: {
                                    type: "string",
                                    default: "default",
                                    requiresArg: true,
                                },
                                region: {
                                    type: "string",
                                    default: "ap-northeast-2",
                                },
                                service: {
                                    type: "string",
                                },
                                ecr: {
                                    type: "string",
                                    requiresArg: true,
                                },
                                "root-domain": {
                                    alias: "root",
                                    type: "string",
                                    requiresArg: true,
                                },
                                "record-domain": {
                                    alias: "record",
                                    type: "string",
                                    requiresArg: true,
                                },
                                port: {
                                    type: "number",
                                    default: 8000,
                                },
                                "database-port": {
                                    alias: "database",
                                    type: "string",
                                    default: 3306,
                                },
                                "vpc-cidr": {
                                    alias: "vpc",
                                    type: "string",
                                    default: "10.0.0.0/16",
                                },
                                "instance-count": {
                                    alias: "instance",
                                    type: "number",
                                    default: 2,
                                },
                                "availability-zone": {
                                    alias: "zone",
                                    type: "string",
                                    default: "ap-northeast-2a,ap-northeast-2b",
                                },
                                "min-capacity": {
                                    alias: "min",
                                    type: "number",
                                    default: 1,
                                },
                                "max-capacity": {
                                    alias: "max",
                                    type: "number",
                                    default: 2,
                                },
                                "instance-cpu": {
                                    alias: "icpu",
                                    type: "number",
                                    default: 1024,
                                },
                                "instance-memory": {
                                    alias: "imem",
                                    type: "number",
                                    default: 2048,
                                },
                                "container-cpu": {
                                    alias: "ccpu",
                                    type: "number",
                                    default: 512,
                                },
                                "container-memory": {
                                    alias: "cmem",
                                    type: "number",
                                    default: 1024,
                                },
                            }).argv];
                    case 2:
                        options = _a.sent();
                        if (!options.service || !options.ecr) {
                            console.log("Please provide a service name and ecr name");
                            process.exit(1);
                        }
                        if (!options.rootDomain || !options.recordDomain) {
                            console.log("Please provide root and record domain");
                            process.exit(1);
                        }
                        return [2 /*return*/, options];
                    case 3:
                        if (!(templateOptions.template === "s3-web")) return [3 /*break*/, 5];
                        return [4 /*yield*/, yargs_1.default.usage(chalk_1.default.cyan("S3 Web Options")).options({
                                template: {
                                    type: "string",
                                    requiresArg: true,
                                },
                                profile: {
                                    type: "string",
                                    default: "default",
                                    requiresArg: true,
                                },
                                region: {
                                    type: "string",
                                    default: "ap-northeast-2",
                                },
                                bucket: {
                                    type: "string",
                                    requiresArg: true,
                                },
                                "cloudfront-comment": {
                                    alias: "comment",
                                    type: "string",
                                },
                                "root-domain": {
                                    alias: "root",
                                    type: "string",
                                    requiresArg: true,
                                },
                                "record-domain": {
                                    alias: "record",
                                    type: "string",
                                    requiresArg: true,
                                },
                            }).argv];
                    case 4:
                        options = _a.sent();
                        if (!options.bucket) {
                            console.log("Please provide a bucket name");
                            process.exit(1);
                        }
                        if (!options.cloudfrontComment) {
                            options.cloudfrontComment = "S3 Web Hosting for ".concat(options.bucket, " by Terraform");
                        }
                        if (!options.rootDomain || !options.recordDomain) {
                            console.log("Please provide root and record domain");
                            process.exit(1);
                        }
                        return [2 /*return*/, options];
                    case 5:
                        if (!templateOptions.template) {
                            console.log("Please provide a template name");
                            process.exit(1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TerraformCLI.writeECSFargateTFVars = function (argv) {
        var flattenFile = (0, flat_1.flatten)(ecs_fargate_json_1.default);
        for (var _i = 0, _a = Object.entries(flattenFile); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value !== "string" ||
                !value.includes("<") ||
                !value.includes(">"))
                continue;
            if (value.includes("<SERVICE_NAME>")) {
                flattenFile[key] = value.replace("<SERVICE_NAME>", argv.service);
            }
            if (value.includes("<ECR_REPO>")) {
                flattenFile[key] = argv.ecr;
            }
            if (value.includes("<PORT>")) {
                flattenFile[key] = argv.port;
            }
            if (value.includes("<DATABASE_PORT>")) {
                flattenFile[key] = argv.databasePort;
            }
            if (value.includes("<REGION>")) {
                flattenFile[key] = value.replace("<REGION>", argv.region);
            }
            if (value.includes("<AVAILABILITY_ZONE>")) {
                flattenFile[key] = argv.availabilityZone.split(",");
            }
            if (value.includes("<PROFILE>")) {
                flattenFile[key] = argv.profile;
            }
            if (value.includes("<VPC_CIDR>")) {
                flattenFile[key] = argv.vpcCidr;
            }
            if (value.includes("<ROOT_DOMAIN>")) {
                flattenFile[key] = value.replace("<ROOT_DOMAIN>", argv.rootDomain);
            }
            if (value.includes("<RECORD_DOMAIN>")) {
                flattenFile[key] = value.replace("<RECORD_DOMAIN>", argv.recordDomain);
            }
            if (value.includes("<MIN_CAPACITY>")) {
                flattenFile[key] = argv.minCapacity;
            }
            if (value.includes("<MAX_CAPACITY>")) {
                flattenFile[key] = argv.maxCapacity;
            }
            if (value.includes("<INSTANCE_COUNT>")) {
                flattenFile[key] = argv.instanceCount;
            }
            if (value.includes("<INSTANCE_CPU>")) {
                flattenFile[key] = argv.instanceCpu;
            }
            if (value.includes("<INSTANCE_MEMORY>")) {
                flattenFile[key] = argv.instanceMemory;
            }
            if (value.includes("<CONTAINER_CPU>")) {
                flattenFile[key] = argv.containerCpu;
            }
            if (value.includes("<CONTAINER_MEMORY>")) {
                flattenFile[key] = argv.containerMemory;
            }
            var newConfig = (0, flat_1.unflatten)(flattenFile);
            fs_extra_1.default.writeJsonSync("./variables.tfvars.json", newConfig, {
                spaces: 2,
            });
        }
    };
    TerraformCLI.writeS3WebTFVars = function (argv) {
        var flattenFile = (0, flat_1.flatten)(s3_web_json_1.default);
        for (var _i = 0, _a = Object.entries(flattenFile); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value !== "string" ||
                !value.includes("<") ||
                !value.includes(">"))
                continue;
            if (value.includes("<REGION>")) {
                flattenFile[key] = value.replace("<REGION>", argv.region);
            }
            if (value.includes("<PROFILE>")) {
                flattenFile[key] = argv.profile;
            }
            if (value.includes("<BUCKET_NAME>")) {
                flattenFile[key] = value.replace("<BUCKET_NAME>", argv.bucket);
            }
            if (value.includes("<CLOUDFRONT_COMMENT>")) {
                flattenFile[key] = argv.cloudfrontComment;
            }
            if (value.includes("<ROOT_DOMAIN>")) {
                flattenFile[key] = value.replace("<ROOT_DOMAIN>", argv.rootDomain);
            }
            if (value.includes("<RECORD_DOMAIN>")) {
                flattenFile[key] = value.replace("<RECORD_DOMAIN>", argv.recordDomain);
            }
            var newConfig = (0, flat_1.unflatten)(flattenFile);
            fs_extra_1.default.writeJsonSync("./variables.tfvars.json", newConfig, {
                spaces: 2,
            });
        }
    };
    TerraformCLI.writeTFVars = function (argv) {
        if (argv.template === "ecs-fargate") {
            this.writeECSFargateTFVars(argv);
        }
        if (argv.template === "s3-web") {
            this.writeS3WebTFVars(argv);
        }
    };
    return TerraformCLI;
}());
exports.default = TerraformCLI;
