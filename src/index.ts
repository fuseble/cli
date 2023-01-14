#! /usr/bin/env node
process.env.DEBUG = 'cli:*';

import OpenAPICLI from './openapi';
import TerraformCLI from '@/terraform';
import TemplateCLI from '@/template';
import GithubCLI from '@/github';
import PrismaCLI from './prisma';

const CLI_COMMANDS: string[] = ['template', 'openapi', 'terraform', 'prisma', 'github'];

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
      console.log(`Invalid command provided: command types ${CLI_COMMANDS.join(', ')}`);
      process.exit(1);
    }

    this.command = CLI_COMMANDS.find((command) => args.includes(command));
  }

  public async getOptions() {
    let options: any = {};

    switch (this.command) {
      case 'template':
        await TemplateCLI.init();
        break;
      case 'openapi':
        await OpenAPICLI.init();
        break;
      case 'terraform':
        await TerraformCLI.init();
        break;
      case 'prisma':
        options = await PrismaCLI.getOptions();
        await PrismaCLI.writePrismaSchema(options);
        break;
      case 'github':
        options = await GithubCLI.getOptions();
        await GithubCLI.commits(options);
        break;
      default:
        console.log(`Invalid command provided`);
        process.exit(1);
    }
  }
}

new CLI();
