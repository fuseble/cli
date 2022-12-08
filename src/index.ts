#! /usr/bin/env node

import OpenAPICLI from "./openapi";
import TerraformCLI from "./terraform";
import TemplateCLI from "./git-template";
import PrismaCLI from "./prisma";

const CLI_COMMANDS: string[] = ["template", "openapi", "terraform", "prisma"];

class CLI {
  private command: string | undefined;

  constructor() {
    this.validateCommand();
    this.getOptions().then();
  }

  public validateCommand() {
    const args = process.argv.slice(2) as string[];

    if (args.length === 0) {
      console.log(`No command provided`);
      process.exit(1);
    }
    if (!args.some((arg) => CLI_COMMANDS.includes(arg))) {
      console.log(`Invalid command provided`);
      process.exit(1);
    }

    this.command = CLI_COMMANDS.find((command) => args.includes(command));
  }

  public async getOptions() {
    let options: any = {};

    switch (this.command) {
      case "template":
        options = await TemplateCLI.getOptions();
        await TemplateCLI.cloneTemplate(options);
        break;
      case "openapi":
        await OpenAPICLI.writeOpenAPIFunctions();
        break;
      case "terraform":
        options = await TerraformCLI.getOptions();
        TerraformCLI.writeTFVars(options);
        break;
      case "prisma":
        options = await PrismaCLI.getOptions();
        await PrismaCLI.writePrismaSchema(options);
        break;
      default:
        console.log(`Invalid command provided`);
        process.exit(1);
    }
  }
}

new CLI();
