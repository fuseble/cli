import { nanoid } from 'nanoid';
import { getSubdirectoryFromGithub } from '@/utils';
import getOptions from './options';
import { printTemplate } from './utils';

export default class TemplateCLI {
  constructor() {}

  public static init = async () => {
    const options = await getOptions();
    if (options.print) {
      await printTemplate(options.branch);
      process.exit(0);
    }

    const tempProjectName = nanoid(10);

    try {
      const [path, newPath] = (() => {
        const pathArray = [tempProjectName, options.stack, options.template];
        return [pathArray.join('/'), `${options.stack}-${options.template}`];
      })();

      await getSubdirectoryFromGithub({
        orgainzation: 'fuseble',
        repository: 'template',
        projectName: tempProjectName,
        branch: options.branch,
        src: path,
        dest: options.name || newPath,
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
}
