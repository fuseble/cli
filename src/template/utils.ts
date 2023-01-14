import axios from 'axios';
import getDebug from 'debug';

const debug = getDebug('cli:template');

const getTemplate = async (branch = 'main') => {
  try {
    return await axios
      .get(`https://raw.githubusercontent.com/fuseble/template/${branch}/cli.json`)
      .then((res) => res.data);
  } catch (error) {
    return null;
  }
};

export const printTemplate = async (branch = 'main') => {
  const template = await getTemplate(branch);
  if (!template) return;

  Object.entries(template).forEach(([stack, templates]: [string, any], index) => {
    debug(`  ${index + 1}: ${stack}`);
    templates.forEach((template) => {
      debug(`    - ${template}`);
    });
  });

  return;
};
