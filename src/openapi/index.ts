import axios, { AxiosError } from "axios";
import yargs from "yargs";
import chalk from "chalk";
import fs from "fs";

import { parseOpenAPI as functionOpenAPI } from "./functions";
import { parseOpenAPI as schemaOpenAPI } from "./models";
import { parseOpenAPI as reactHookOpenAPI } from "./react-hook";

export default class OpenAPICLI {
  public static async init() {
    const options = await yargs.usage(chalk.cyan(``)).options({
      url: {
        alias: "u",
        describe: "URL of the OpenAPI",
        type: "string",
        requiresArg: true,
      },
      service: {
        describe: "Create Service",
        type: "boolean",
        requiresArg: false,
      },
      schema: {
        describe: "Create Schema types",
        type: "boolean",
        requiresArg: false,
      },
      "react-hook": {
        describe: "Create React Hook",
        type: "boolean",
        requiresArg: false,
      },
      "filter-tag": {
        describe: "Filter by tag",
        type: "string",
      },
      "filter-path": {
        describe: "Filter by path",
        type: "string",
      },
    }).argv;
    if (!options.url) {
      console.log(`Please provide a URL`);
      process.exit(1);
    }

    const url = options.url;
    if (options.service) {
      await this.writeOpenAPIFunctions(url);
    }

    if (options.schema) {
      await this.writeOpenAPISchemas(url);
    }

    if (options.reactHook) {
      await this.writeOpenAPIReactHook(url, {
        tag: options.filterTag,
        path: options.filterPath,
      });
    }
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
      const e = error as AxiosError;
      console.error(`Error fetching OpenAPI`);
      process.exit(1);
    }
  }

  public static async writeOpenAPIFunctions(url: string) {
    const openapi = await this.getOpenAPI(url);
    const functions = functionOpenAPI(openapi);

    fs.writeFile("./services.ts", functions, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      console.log(`OpenAPI functions written to './services.ts'`);
    });
  }

  public static async writeOpenAPISchemas(url: string) {
    const openapi = await this.getOpenAPI(url);
    const schemas = schemaOpenAPI(openapi);

    fs.writeFile("./schemas.ts", schemas, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      console.log(`OpenAPI models written to './schemas.ts'`);
    });
  }

  public static async writeOpenAPIReactHook(
    url: string,
    filter: { tag?: string; path?: string }
  ) {
    await this.writeOpenAPIFunctions(url);

    const openapi = await this.getOpenAPI(url);
    const reactHook = reactHookOpenAPI(openapi, filter);

    fs.writeFile("./useOpenAPIHook.ts", reactHook, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      console.log(`OpenAPI react hook written to './useOpenAPIHook.ts'`);
    });
  }
}
