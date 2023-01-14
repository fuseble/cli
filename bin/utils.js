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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubdirectoryFromGithub = exports.getFiles = exports.removeFolder = exports.moveFolder = exports.checkFolder = void 0;
var fs = __importStar(require("fs-extra"));
var promises_1 = require("fs/promises");
var child_process_1 = require("child_process");
var path_1 = require("path");
var debug_1 = __importDefault(require("debug"));
var debug = (0, debug_1.default)('cli:template');
var checkFolder = function (path) {
    if (Array.isArray(path)) {
        path = path.join('/');
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
var getFiles = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var dirents, files;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readdir)(dir, { withFileTypes: true })];
            case 1:
                dirents = _b.sent();
                return [4 /*yield*/, Promise.all(dirents.map(function (dirent) {
                        var res = (0, path_1.resolve)(dir, dirent.name);
                        return dirent.isDirectory() ? (0, exports.getFiles)(res) : res;
                    }))];
            case 2:
                files = _b.sent();
                return [2 /*return*/, (_a = Array.prototype).concat.apply(_a, files)];
        }
    });
}); };
exports.getFiles = getFiles;
var getSubdirectoryFromGithub = function (_a) {
    var orgainzation = _a.orgainzation, repository = _a.repository, projectName = _a.projectName, branch = _a.branch, src = _a.src, dest = _a.dest;
    try {
        (0, child_process_1.execSync)("git clone https://github.com/".concat(orgainzation, "/").concat(repository, " ").concat(projectName));
        if (branch !== 'main') {
            (0, child_process_1.execSync)("cd ".concat(projectName, " && git checkout ").concat(branch, " && cd ../"));
        }
        var isExist = (0, exports.checkFolder)(src);
        if (!isExist) {
            throw new Error('Cannot find path in project');
        }
        (0, exports.moveFolder)(src, dest);
        (0, exports.removeFolder)(projectName);
    }
    catch (e) {
        var error = e;
        debug("Error occoured ".concat((error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'));
        process.exit(1);
    }
};
exports.getSubdirectoryFromGithub = getSubdirectoryFromGithub;
