import "./console";
import TemplateCLI from "./template";
import OpenAPICLI from "./openapi";

const CLI_COMMANDS = ["template", "openapi"];

class CLI {
  private command: string | undefined;

  constructor() {
    this.validateCommand();
    this.getOptions().then();
  }

  public validateCommand() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log(`No command provided`);
      process.exit(1);
    }
    if (!CLI_COMMANDS.includes(args[0])) {
      console.log(`Invalid command provided`);
      process.exit(1);
    }

    this.command = args[0];
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
      default:
        console.log(`Invalid command provided`);
        process.exit(1);
    }
  }
}

new CLI();
