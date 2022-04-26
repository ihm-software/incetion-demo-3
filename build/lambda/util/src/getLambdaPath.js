"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsoluteLambdaPath = void 0;
const path_1 = __importDefault(require("path"));
const getAbsoluteLambdaPath = (lambdaName) => {
    return path_1.default.resolve(path_1.default.join('lambda', lambdaName, 'index.ts'));
};
exports.getAbsoluteLambdaPath = getAbsoluteLambdaPath;
//# sourceMappingURL=getLambdaPath.js.map