"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubdirectoryFromGithub = exports.removeFolder = exports.moveFolder = exports.checkFolder = void 0;
const fs = require("fs-extra");
const child_process_1 = require("child_process");
const checkFolder = (path) => {
    if (Array.isArray(path)) {
        path = path.join("/");
    }
    return fs.existsSync(path);
};
exports.checkFolder = checkFolder;
const moveFolder = (src, dest) => {
    fs.moveSync(src, dest, { overwrite: true });
};
exports.moveFolder = moveFolder;
const removeFolder = (path) => {
    fs.removeSync(path);
};
exports.removeFolder = removeFolder;
const getSubdirectoryFromGithub = ({ orgainzation, repository, projectName, branch, src, dest, }) => {
    try {
        (0, child_process_1.execSync)(`git clone https://github.com/${orgainzation}/${repository} ${projectName}`);
        (0, child_process_1.execSync)(`cd ${projectName} && git checkout ${branch} && cd ../`);
        const isExist = (0, exports.checkFolder)(src);
        if (!isExist) {
            throw new Error("Cannot find path in project");
        }
        (0, exports.moveFolder)(src, dest);
        (0, exports.removeFolder)(projectName);
    }
    catch (e) {
        const error = e;
        console.log((error === null || error === void 0 ? void 0 : error.message) || "Unknown error");
        process.exit(1);
    }
};
exports.getSubdirectoryFromGithub = getSubdirectoryFromGithub;
