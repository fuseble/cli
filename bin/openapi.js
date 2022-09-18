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
exports.createPatch = exports.createDelete = exports.createPut = exports.createPost = void 0;
const axios_1 = require("axios");
const yargs = require("yargs");
const chalk = require("chalk");
const camelcase = require("camelcase");
const fs = require("fs");
const createAxiosClient = (urls) => `
import axios from 'axios';
import qs from 'qs';

const apiClient = axios.create({
  baseURL: '${urls[0]}',
  timeout: 1000 * 5,
});

apiClient.defaults.paramsSerializer = params => {
  return qs.stringify(params);
}
`;
const createApiFunctionName = (method, url) => {
    const splitUrl = url.split("/").map((part) => {
        if (part.includes("{") && part.includes("}")) {
            const param = part.replace("{", "").replace("}", "");
            return param;
        }
        return part;
    });
    return camelcase([method, ...splitUrl]);
};
const createGet = (url) => {
    const functionName = createApiFunctionName("get", url);
    return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.get('${url}', { params });
  return data;
};
  `;
};
const createPost = (url) => {
    const functionName = createApiFunctionName("post", url);
    return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.post('${url}', params);
  return data;
};
  `;
};
exports.createPost = createPost;
const createPut = (url) => {
    const functionName = createApiFunctionName("put", url);
    return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.put('${url}', params);
  return data;
};
  `;
};
exports.createPut = createPut;
const createDelete = (url) => {
    const functionName = createApiFunctionName("delete", url);
    return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.delete('${url}', { params });
  return data;
};
  `;
};
exports.createDelete = createDelete;
const createPatch = (url) => {
    const functionName = createApiFunctionName("patch", url);
    return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.patch('${url}', params);
  return data;
};
  `;
};
exports.createPatch = createPatch;
class OpenAPICLI {
    constructor() { }
    static getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield yargs.usage(chalk.cyan(``)).options({
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
            }).argv;
            return options;
        });
    }
    static getOpenAPI(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                console.log(`Please provide a URL`);
                process.exit(1);
            }
            try {
                const response = yield axios_1.default.get(url);
                return response.data;
            }
            catch (error) {
                process.exit(1);
            }
        });
    }
    static parseOpenAPI(openapi) {
        const initApiClient = createAxiosClient(openapi.servers.map((server) => server.url));
        const functions = Object.entries(openapi.paths).reduce((acc, [path, attribute]) => {
            Object.entries(attribute).forEach(([method, value]) => {
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
        return `${initApiClient}${functions}`;
    }
    static writeOpenAPIFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.getOptions();
            const openapi = yield this.getOpenAPI(options.url);
            const functions = this.parseOpenAPI(openapi);
            fs.writeFile(`${options.path}` || "./service.ts", functions, (err) => {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
                console.log(`OpenAPI functions written to ${options.path}`);
            });
        });
    }
}
exports.default = OpenAPICLI;
