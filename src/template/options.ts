import yargs from 'yargs';
import getDebug from 'debug';

const debug = getDebug('cli:template');

const getOptions = async () => {
  const argv = await yargs.options({
    stack: {
      alias: 's',
      describe: 'Stack to use',
      type: 'string',
    },
    template: {
      alias: 't',
      describe: 'Template to use',
      type: 'string',
    },
    name: {
      alias: 'n',
      describe: 'Name of the project',
      type: 'string',
    },
    branch: {
      alias: 'b',
      describe: 'Branch to use',
      type: 'string',
      default: 'main',
    },
    print: {
      alias: 'p',
      describe: 'Print template info',
      type: 'boolean',
      default: false,
    },
  }).argv;

  if (!argv.print && (!argv.stack || !argv.template)) {
    debug('Please provide a template and stack');
    process.exit(1);
  }

  return argv;
};

export default getOptions;
