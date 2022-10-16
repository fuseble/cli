import axios from "axios";
import yargs from "yargs";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { getSubdirectoryFromGithub } from "./utils";

export default class TemplateCLI {
  constructor() {}

  public static async getOptions() {
    const options = await yargs.usage(chalk.cyan(``)).options({
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
      },
      branch: {
        alias: "b",
        describe: "Branch to use",
        type: "string",
        default: "main",
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
      await this.printTemplateInfo();
      process.exit(0);
    }

    return options;
  }

  public static async getTemplateInfos() {
    try {
      const url =
        "https://raw.githubusercontent.com/fuseble/template/main/cli.json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return null;
    }
  }

  public static async printTemplateInfo() {
    const templateInfo = (await this.getTemplateInfos()) as Promise<
      Record<string, string[]>
    >;
    if (!templateInfo) return null;

    Object.entries(templateInfo).forEach(
      ([stack, templates]: [string, string[]], index: number) => {
        console.log(`  ${index + 1}: ${stack}`);
        templates.forEach((template) => {
          console.log(`    - ${template}`);
        });
      }
    );

    return true;
  }

  public static async cloneTemplate(options) {
    try {
      const tempProjectName = nanoid(10);

      const [path, newPath] = (() => {
        const pathArray = [tempProjectName, options.stack, options.template];
        return [pathArray.join("/"), `${options.stack}-${options.template}`];
      })();

      getSubdirectoryFromGithub({
        orgainzation: "fuseble",
        repository: "template",
        projectName: tempProjectName,
        branch: options.branch,
        src: path,
        dest: options.name || newPath,
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
