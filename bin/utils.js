"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubdirectoryFromGithub = exports.removeFolder = exports.moveFolder = exports.checkFolder = void 0;
var fs = __importStar(require("fs-extra"));
var child_process_1 = require("child_process");
var checkFolder = function (path) {
    if (Array.isArray(path)) {
        path = path.join("/");
    }
    return fs.existsSync(path);
};
exports.checkFolder = checkFolder;
var moveFolder = function (src, dest) {
    console.log("Moving ".concat(src, " to ").concat(dest));
    fs.moveSync(src, dest, { overwrite: true });
};
exports.moveFolder = moveFolder;
var removeFolder = function (path) {
    fs.removeSync(path);
};
exports.removeFolder = removeFolder;
var getSubdirectoryFromGithub = function (_a) {
    var orgainzation = _a.orgainzation, repository = _a.repository, projectName = _a.projectName, branch = _a.branch, src = _a.src, dest = _a.dest;
    try {
        (0, child_process_1.execSync)("git clone https://github.com/".concat(orgainzation, "/").concat(repository, " ").concat(projectName));
        if (branch !== "main") {
            (0, child_process_1.execSync)("cd ".concat(projectName, " && git checkout ").concat(branch, " && cd ../"));
        }
        var isExist = (0, exports.checkFolder)(src);
        if (!isExist) {
            throw new Error("Cannot find path in project");
        }
        (0, exports.moveFolder)(src, dest);
        (0, exports.removeFolder)(projectName);
    }
    catch (e) {
        var error = e;
        console.log((error === null || error === void 0 ? void 0 : error.message) || "Unknown error");
        process.exit(1);
    }
};
exports.getSubdirectoryFromGithub = getSubdirectoryFromGithub;
