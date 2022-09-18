import axios from "axios";
import * as yargs from "yargs";
import * as chalk from "chalk";
import * as camelcase from "camelcase";
import * as fs from "fs";

const createAxiosClient = (urls: string[]) => `
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

const getApiFunctionName = (method: string, url: string) => {
  const splitUrl = url.split("/").map((part) => {
    if (part.includes("{") && part.includes("}")) {
      const param = part.replace("{", "").replace("}", "");
      return param;
    }
    return part;
  });

  return camelcase([method, ...splitUrl]);
};

const getApiUrlParams = (url: string) => {
  return url
    .split("/")
    .map((part) => {
      if (part.includes("{") && part.includes("}")) {
        const param = part.replace("{", "").replace("}", "");
        return param;
      }
      return undefined;
    })
    .filter(Boolean);
};

const getAPI = (method: string, url: string) => {
  const functionName = getApiFunctionName(method, url);
  const apiUrlParams = getApiUrlParams(url);
  const apiUrl = url.replace(/{/g, "${params.").replace(/}/g, "}");

  return { functionName, apiUrl };
};

const createGet = (url: string) => {
  const { functionName, apiUrl } = getAPI("get", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.get(\`${apiUrl}\`, { params });
  return data;
};
  `;
};

export const createPost = (url: string) => {
  const { functionName, apiUrl } = getAPI("post", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.post(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export const createPut = (url: string) => {
  const { functionName, apiUrl } = getAPI("put", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.put(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export const createDelete = (url: string) => {
  const { functionName, apiUrl } = getAPI("delete", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.delete(\`${apiUrl}\`, { params });
  return data;
};
  `;
};

export const createPatch = (url: string) => {
  const { functionName, apiUrl } = getAPI("patch", url);

  return `
export const ${functionName} = async (params: any) => {
  const { data } = await apiClient.patch(\`${apiUrl}\`, params);
  return data;
};
  `;
};

export default class OpenAPICLI {
  constructor() {}

  public static async getOptions() {
    const options = await yargs.usage(chalk.cyan(``)).options({
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
  }

  public static async getOpenAPI(url?: string) {
    if (!url) {
      console.log(`Please provide a URL`);
      process.exit(1);
    }

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      process.exit(1);
    }
  }

  public static parseOpenAPI(openapi: any) {
    const initApiClient = createAxiosClient(
      openapi.servers.map((server) => server.url)
    );

    const functions = Object.entries(openapi.paths).reduce(
      (acc, [path, attribute]) => {
        Object.entries(attribute as any).forEach(([method, value]) => {
          switch (method) {
            case "get":
              acc += createGet(path);
              break;
            case "post":
              acc += createPost(path);
              break;
            case "put":
              acc += createPut(path);
              break;
            case "delete":
              acc += createDelete(path);
              break;
            case "patch":
              acc += createPatch(path);
              break;
          }
        });
        return acc;
      },
      ""
    );

    return `${initApiClient}${functions}`;
  }

  public static async writeOpenAPIFunctions() {
    const options = await this.getOptions();
    const openapi = await this.getOpenAPI(options.url);
    const functions = this.parseOpenAPI(openapi);

    fs.writeFile(`${options.path}` || "./service.ts", functions, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      console.log(`OpenAPI functions written to ${options.path}`);
    });
  }
}
