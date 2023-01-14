import * as fs from 'fs-extra';
import { readdir } from 'fs/promises';
import { execSync } from 'child_process';
import { resolve } from 'path';
import getDebug from 'debug';

const debug = getDebug('cli:template');

interface IGetSubdirectoriesFromGithub {
  orgainzation: string;
  repository: string;
  projectName: string;
  branch: string;
  src: string;
  dest: string;
}

export const checkFolder = (path: string | string[]): boolean => {
  if (Array.isArray(path)) {
    path = path.join('/');
  }

  return fs.existsSync(path);
};

export const moveFolder = (src: string, dest: string) => {
  console.log(`Moving ${src} to ${dest}`);
  fs.moveSync(src, dest, { overwrite: true });
};

export const removeFolder = (path: string) => {
  fs.removeSync(path);
};

export const getFiles = async (dir: string) => {
  const dirents = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
};

export const getSubdirectoryFromGithub = ({
  orgainzation,
  repository,
  projectName,
  branch,
  src,
  dest,
}: IGetSubdirectoriesFromGithub) => {
  try {
    execSync(`git clone https://github.com/${orgainzation}/${repository} ${projectName}`);

    if (branch !== 'main') {
      execSync(`cd ${projectName} && git checkout ${branch} && cd ../`);
    }

    const isExist = checkFolder(src);
    if (!isExist) {
      throw new Error('Cannot find path in project');
    }

    moveFolder(src, dest);
    removeFolder(projectName);
  } catch (e) {
    const error = e as any;
    debug(`Error occoured ${error?.message || 'Unknown error'}`);

    process.exit(1);
  }
};
